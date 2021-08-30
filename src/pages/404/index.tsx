import * as React from "react";
import "./404.css";
import Layout from "../../components/Layout/Layout";
import notFoundImage from "../../images/404.gif";
import { Link } from "gatsby";

// markup
const NotFoundPage = () => {
  return (
    <Layout pageTitle='You seem a bit lost'>
      <div className='not-found-page'>
        <h1 className='not-found-page__title'>You seem a bit lost</h1>
        <p>The page you're trying to find does not exist.</p>
        <img
          className='not-found-page__image'
          src={notFoundImage}
          alt='Not found image'
        />
        <br />
        <Link to='/'>Take me home</Link>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
