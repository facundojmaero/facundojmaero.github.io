---
title: Writing FastAPI database tests with SQLAlchemy and PostgreSQL
tags:
  - Python
  - Testing
  - FastAPI
pubDatetime: 2021-08-31T12:00:00Z
featured: false
draft: false
ogImage: https://res.cloudinary.com/noezectz/v1663745737/astro-paper/astropaper-x-forestry-og_kqfwp0.png
description:
  Writing FastAPI database tests with SQLAlchemy and PostgreSQL
---

![Introducing AstroPaper 2.0](/assets/alex-gorbi-ETSuraUW390-unsplash.jpg)

## Table of contents

In this article, we're going to explore testing a simple FastAPI application.
Tests will be mainly at the integration level, and we'll start slow and build
up our testing knowledge along the way.

The idea is to show what can happen when testing a REST API, how to set up
the various moving parts and how to make tests less repetitive and, if we're
lucky, fun to write!

If you want to inspect the finished code by yourself,
[you can find it here.](https://github.com/facundojmaero/blog-projects/tree/main/fastapi-db-tests-factoryboy)

## The API

The project is a small application that's used to register Formula 1
information. It handles two types of resources: Drivers and Teams, and it
looks like this:

```
- GET   /teams      -> read F1 Teams
- POST  /teams      -> create a new Team
- GET   /drivers    -> read F1 Drivers
- POST  /drivers    -> create a new Driver
```

Teams can be created on their own, but to create a Driver we need to specify
the Team that signed them.
Let's see some CURL examples, assuming the API runs on `localhost:8080`:

```bash
# Create a Team
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"Red Bull Racing"}' \
  http://localhost:8080/teams


# Create a Driver of that Team
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"Max Verstappen", "number": 33, "nationality": "dutch", "team_id": 1}' \
  http://localhost:8080/drivers

# Get all Drivers
curl http://localhost:8080/drivers
```

## Setting things up

To test this API we'll use [pytest](https://pypi.org/project/pytest/).

The tests we'll write here are integration tests, meaning we don't want to mock
different modules of our app, but want to see things working from making an
HTTP request to getting the response, all while going to the database to store
the data.

What are we working with? The stack is composed of a FastAPI application which
uses SQLAlchemy to interface with Postgres.

To test our app we need some sort of **client**, an object that
can make HTTP requests and deliver the response. Maybe you're thinking of
[requests](https://pypi.org/project/requests/) or
[httpx](https://pypi.org/project/httpx/), two famous libraries
in Python. But luckily FastAPI provides its own `TestClient`, so that's what
we're gonna use today[^1].

### The database session

All of our endpoints use a db **session**, requested on-demand to a
session factory. This factory is bound to an **engine** connected to Postgres
itself.

Assume we have a production database that we **don't** want to touch while
testing, so one thing we could do is create a test database that's exactly the
same just for testing, and then create an **engine** and a **sessionmaker**
connected to that db.
The following fixture provides the discussed functionality:

```python
@pytest.fixture
def db_fixture():
    SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password@localhost:5433/f1.db"

    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    testing_session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    try:
        Base.metadata.create_all(bind=engine)

        db = testing_session_local()
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
```

If you've never seen pytest fixtures, think of it like this: they replace the
`setUp` and `tearDown` functions used in languages like Java and the like.

Fixtures are functions that you can call to get some data or perform some task
you need in a test. They can do things **before** a test (like the `setUp`
hook) and/or **after** a test (like the `tearDown` hook).

These functions are not meant to be called directly. Instead, they are
"required" by every test that needs them. This is performed by defining them
as function arguments of your tests (or other fixtures).

Here we're setting up everything we need to create database sessions.
Then, we create the actual table structure in the db and yield a new db
session.

Everything that runs **before** the `yield` expression happens **before** the
actual test code and everything **after** is considered teardown code.

When the test is done, we're closing the session and destroying the whole
database, in order to make sure our tests are independent of each other.
There are better ways to handle this setup and teardown procedure, but that's
a story for another day.

The last thing we need is a way of getting a `TestClient` bound to our api.

```python
@pytest.fixture()
def client(db_fixture):
    def override_get_db():
        yield db_fixture

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    del app.dependency_overrides[get_db]
```

In production code, the db session is provided by a function called `get_db`.
Here we're overriding it with our own function that returns a session to the
newly created test db. You can find more information about overriding
FastAPI dependencies [in the official docs](https://fastapi.tiangolo.com/uk/advanced/testing-database/).

## Writing tests

Now that we have the needed basic fixtures, let's write our first test that
creates an F1 Team:

```python
def test_create_one_team(client):
    team_data = {"name": "Scuderia Ferrari"}

    response = client.post("/teams", json=team_data)

    received = response.json()
    expected = {"id": 1, "name": "Scuderia Ferrari"}

    assert response.status_code == 200
    assert received == expected
```

We're defining the data to send in `team_data`, making a POST request and
verifying the response is what we sent.

Since we're setting up and tearing down the database between tests, we can
run it as many times as we want and it will always work.

Next test! Now let's check the GET request:

```python
def test_get_team(client):
    team_data = {"name": "Scuderia Ferrari"}
    _ = client.post("/teams", json=team_data)

    response = client.get("/teams")

    expected = [{"id": 1, "name": team_data["name"]}]

    assert response.status_code == 200
    assert response.json() == expected
```

Here we're creating a Team, then fetching all Teams, and checking the retrieved
list has the newly created Team in it.

Again, since the db is empty, to test we can get a Team, we need to create it
first. This works, but can we do better? This code has some issues, let's see
why.

In order to test the **retrieval** of a Team, we need to **create** one with
another endpoint. Lucky us we have that `POST /teams` endpoint lying around
right? But what happens if our API contract didn't have a POST endpoint like
that? In other words, here we had to use one endpoint to test another.

Maybe a better way would be to interact with the database "behind the scenes"
to create the resource we need, and only interact with the endpoint we're
testing at the moment. Let's do that:

```python
from src import crud

def test_get_team_orm(client, db_fixture):
    team_data = {"name": "Scuderia Ferrari"}

    crud.create_team(db=db_fixture, team=team_data)

    response = client.get("/teams")

    expected = [{"id": 1, "name": team_data["name"]}]

    assert response.status_code == 200
    assert response.json() == expected
```

We're using the `client` only once, and we're creating a Team using the `crud`
module from our application directly.

Analysis time again. The `team_data` is defined here in the test case and used
to create the record and make the test assertion. When more test cases are
written, this variable will be needed again and again. Sounds like we can write
another fixture right?

Well, yes, and no. A fixture to avoid repeating Team data is definitely a good
idea, but what if we want to create a Team with another name? Or create more
than one Team in a single test?
We would need to grab the fixture, make a copy, and edit some attributes.

See where I'm going? Sometimes these fixtures are not as flexible as we wish
for use cases like this.

### Using factoryboy

There's a handy Python library called
[factoryboy](https://pypi.org/project/factory-boy/) that can help us with this
fixture issue. According to their own docs:

> As a fixtures replacement tool, [factoryboy] aims to replace static, hard to
> maintain fixtures with easy-to-use factories for complex objects.

A factory is a class that builds objects. When you define them, you specify the
attributes of this object, as well as default values that can be overridden
later.

Our api has a `schemas` module with the shape of data expected by each endpoint.
This way, we can define a factory for each schema and use them in our tests.
Let's see an example:

```python
import factory

class TeamCreateFactory(factory.Factory):
    class Meta:
        model = schemas.TeamCreate

    name = factory.Sequence(lambda n: f"Team {n}")
```

Here we defined a factory class, assigned the model class to create
(`TeamCreate` in this case), and wrote the fields one by one.
These fields can take hardcoded values or can be dynamically assigned using
`Sequences` or other factories (more on this later).

So how do these factories help us in the previous test cases? Let's see a simple
example:

```python
def test_create_one_team_factoryboy(client):
    team_data = factories.TeamCreateFactory()

    response = client.post("/teams", json=team_data.dict())
    expected = {"id": 1, "name": team_data.name}

    assert response.status_code == 200
    assert response.json() == expected

def test_create_one_team_factoryboy_custom_name(client):
    team_data = factories.TeamCreateFactory(name="Mercedes-AMG")

    response = client.post("/teams", json=team_data.dict())
    expected = {"id": 1, "name": "Mercedes-AMG"}

    assert response.status_code == 200
    assert response.json() == expected
```

Here the `team_data` creation is handled by our factory. Calling it gives us
a new `schemas.TeamCreate` object with default attributes, but they
can be overridden using `kwargs`, as seen in the second test.

This could be fantastic for testing our app! Think about it, we could have
a Team factory, and a Driver factory, so we just call them without having to
worry about it in every test.

We can push this a bit further, and let `factoryboy` handle database record
creation. This means we could call a factory and it would go to the database,
create a record and give it back. All that in a single line of code.

As explained [in the docs](https://factoryboy.readthedocs.io/en/stable/orms.html#sqlalchemy),
when working with SQLAlchemy, factories need access to a `session` to interact
with the database, set in the `sqlalchemy_session` metaclass attribute.
So a factory that's able to create db records would look like this:

```python
class TeamModelFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = database.Team
        sqlalchemy_session = session

    name = factory.Sequence(lambda n: f"Team {n}")
```

But where does this `session` come from? [The docs](https://factoryboy.readthedocs.io/en/stable/orms.html#managing-sessions)
suggest using a `scoped_session` to request a session when the factories are
called.
In other words, factories need a way to get a session _at coding time_,
but we can't do that. Remember, our db sessions are obtained as dependencies
when an endpoint needs them. That's when the code is executed when the actual
production code is called.

So how do we fix this? One way consists of a fixture that requests a session
and gives it to factories. We would be creating factories and then injecting
the session using fixtures. Sounds confusing but it's not that weird, look:

```python
class SQLAlchemyFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        abstract = True
        sqlalchemy_session_persistence = "flush"

    @classmethod
    def save_db_session(cls, session) -> None:
        cls._meta.sqlalchemy_session = session

        for cls_attr in vars(cls).values():
            if hasattr(cls_attr, "get_factory"):
                cls_attr.get_factory().save_db_session(session=session)

class TeamModelFactory(SQLAlchemyFactory):
    class Meta:
        model = database.Team

    name = factory.Sequence(lambda n: f"Team {n}")

@pytest.fixture(autouse=True)
def _setup_factories(db_fixture):
    TeamModelFactory.save_db_session(session=db_fixture)
```

The `SQLAlchemyFactory` is our new base class. It has a `save_db_session` method
that's called by fixtures **before** each test is run.
The method also loops over the class fields to set the session in any
subfactory, if any.

Then we define a new factory that inherits from this new base class, same as
before.

Finally, the moment of truth. Let's use our fancy new factory to create a
database record automatically!

```python
def test_get_team_sqlalchemy_factory(client):
    created_team = factories.TeamModelFactory()

    response = client.get("/teams")

    expected = [{"id": 1, "name": created_team.name}]

    assert response.status_code == 200
    assert response.json() == expected
```

No requiring a db session explicitly and no repeating fixture data.
The `TeamModelFactory()` call does all for us. We can even use it to create many
Teams using the `create_batch` method:

```python
def test_get_many_teams_sqlalchemy_factory(client):
    created_teams = factories.TeamModelFactory.create_batch(3)

    response = client.get("/teams")

    assert response.status_code == 200
    assert len(response.json()) == 3
```

This approach is overkill for such a simple example, but I hope you
can imagine its potential when used with more complex database schemas and data
relations.

### Using SubFactories

To get a bit closer to real life, let's write a factory to create a Driver:

```python
class DriverModelFactory(SQLAlchemyFactory):
    class Meta:
        model = database.Driver

    id = factory.Sequence(lambda n: n)
    name = factory.Iterator(["Facundo", "Joaquin"])
    number = factory.Sequence(lambda n: n)
    nationality = factory.Iterator(["Argentina", "France"])
    team = factory.SubFactory(TeamModelFactory)
```

This factory looks just like the Teams one, but since we cannot create a Driver
without a Team, we need to set that link somewhere. This is where a `SubFactory`
comes in handy. We're telling factoryboy that the `team` attribute of a Driver
is filled with the output of a `TeamModelFactory`.

A test that uses this class could look like this:

```python
def test_get_drivers(client):
    driver = factories.DriverModelFactory()

    response = client.get("/drivers")
    expected = [
        {
            "id": driver.id,
            "name": driver.name,
            "number": driver.number,
            "nationality": driver.nationality,
            "team": {
                "name": driver.team.name,
            }
        }
    ]

    assert response.status_code == 200
    assert response.json() == expected
```

Again, think about this. With one line of code, we're creating two database
records. Tests can't get simpler than this, right?

### Factories as Fixtures

Well, we can go one tiny step further. Remember when we talked about using
fixtures as a way of "requiring" things we need in tests? What if we could tell
pytest that we want to create a Driver by using a fixture?

A package called [pytest-factoryboy](https://pypi.org/project/pytest-factoryboy/)
does just that. It makes `factoryboy` act like proper pytest fixtures, making
these tests even better.

The only change we need to use fixtures like this is to `register` our
factories. This will tell pytest a couple of new fixtures are available.

```python
register(TeamModelFactory)
register(TeamCreateFactory)
register(DriverModelFactory)
```

Once the factories are registered, they are available in two ways:

- The factory itself is available as a fixture named like the factory class
  (`TeamModelFactory` becomes `team_model_factory`, `TeamCreateFactory` becomes
  `team_create_factory` and so on)
- You can just ask pytest to create an object and give it to you by using
  the `model` class name (`database.Team` becomes `team`, `database.Driver`
  becomes `driver`)

Let's see some examples to illustrate this:

```python
def test_get_many_teams_sqlalchemy_factory_pytest(client, team_model_factory):
    created_teams = team_model_factory.create_batch(3)

    response = client.get("/teams")

    assert response.status_code == 200
    assert len(response.json()) == 3

def test_get_team_sqlalchemy_factory_pytest(client, team):
    response = client.get("/teams")

    expected = [{"id": 1, "name": team.name}]

    assert response.status_code == 200
    assert response.json() == expected

def test_get_drivers_sqlalchemy_factory_pytest(client, driver):
    response = client.get("/drivers")
    expected = [
        {
            "id": driver.id,
            "name": driver.name,
            "number": driver.number,
            "nationality": driver.nationality,
            "team": {
                "name": driver.team.name,
            },
        }
    ]

    assert response.status_code == 200
    assert response.json() == expected
```

These factories even support pytest's very powerful `parametrize` functionality
to customize the built object using a [double underscore](https://pytest-factoryboy.readthedocs.io/en/latest/#attributes-are-fixtures):

```python
@pytest.mark.parametrize("team__name", ["Alpine F1 Team"])
def test_get_team_sqlalchemy_factory_pytest_custom(client, team):
    response = client.get("/teams")

    expected = [{"id": 1, "name": "Alpine F1 Team"}]

    assert response.status_code == 200
    assert response.json() == expected

@pytest.mark.parametrize("driver__name", ["Valtteri Bottas"])
@pytest.mark.parametrize("driver__number", [77])
def test_get_drivers_sqlalchemy_factory_pytest_custom(client, driver):
    response = client.get("/drivers")
    expected = [
        {
            "id": driver.id,
            "name": "Valtteri Bottas",
            "number": 77,
            "nationality": driver.nationality,
            "team": {
                "name": driver.team.name,
            },
        }
    ]

    assert response.status_code == 200
    assert response.json() == expected
```

Last cool feature: we can register factories by giving them a name, and
overriding some of their attributes, to get more specific objects when needed:

```python
register(
    TeamModelFactory,
    "red_bull",
    name="Red Bull Racing",
)

register(
    DriverModelFactory,
    "max_verstappen",
    name="Max Verstappen",
    number=33,
    nationality="Dutch",
    team=LazyFixture("red_bull"),
)
```

We're registering a fixture called `red_bull` and another called
`max_verstappen`. They are regular fixtures but all (or some) of the data is
overridden.

```python
def test_get_red_bull(client, red_bull):
    response = client.get("/teams")

    expected = [{"id": 1, "name": "Red Bull Racing"}]

    assert response.status_code == 200
    assert response.json() == expected


def test_get_verstappen(client, max_verstappen):
    response = client.get("/drivers")
    expected = [
        {
            "id": max_verstappen.id,
            "name": "Max Verstappen",
            "number": 33,
            "nationality": "Dutch",
            "team": {
                "name": "Red Bull Racing",
            },
        }
    ]

    assert response.status_code == 200
    assert response.json() == expected

```

## Conclusion

Writing integration tests for a FastAPI project can be a difficult task, but
tools like `factoryboy` and its plugins can help a lot, even with a naive
API such as the one presented here.

If you want, you can check out the [full code of this article](https://github.com/facundojmaero/blog-projects/tree/main/fastapi-db-tests-factoryboy).
It has instructions on how to set everything up and run the tests yourself.
PRs and comments are welcome!

[^1]: Fun fact: FastAPI's `TestClient` itself uses `requests` under the hood.
