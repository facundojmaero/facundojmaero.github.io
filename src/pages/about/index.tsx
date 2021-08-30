import * as React from "react";
import Layout from "../../components/Layout/Layout";
import { StaticImage } from "gatsby-plugin-image";
import "./about.css";

const AboutPage = () => {
  return (
    <Layout pageTitle='About Me'>
      <div className='about-page'>
        <div className='about-page__profile'>
          <h1 className='about-page__profile__title'>About me</h1>
          <StaticImage
            className='about-page__profile__image'
            alt='Profile picture'
            src='../../images/me.jpg'
          />
        </div>
        <div className='about-page__content'>
          <p>
            Hey there, Facundo here! I’m a computer engineer from Córdoba,
            Argentina. I spend my days mainly working with Python, JavaScript,
            TypeScript and Docker building backend and frontend systems.
          </p>
          <p>
            My favorite hobbies are coding, reading, and learning new things. I
            also love music from a wide variety of genres, but I mainly spend
            time listening to prog and alternative rock.
          </p>
          <p>
            Other things I enjoy are watching Formula 1, playing tennis and
            padel, and occasionally gaming solo or with my friends. There may be
            some easter eggs related to these topics around the blog. You have
            been warned ;)
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
