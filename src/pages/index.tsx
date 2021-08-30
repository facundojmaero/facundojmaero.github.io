import * as React from "react";
import Layout from "../components/Layout/Layout";

import "./index.css";

const IndexPage = () => {
  return (
    <Layout pageTitle='Home Page'>
      <div className='index'>
        <h1 className='index__title'>Hello there!</h1>
        <p className='index__paragraph'>
          I'm Facundo, a computer engineer based at Córdoba, Argentina.
        </p>
        <p className='index__paragraph'>
          This is my personal blog for projects I've created, posts I've
          written, and anything else I consider worth sharing with the world.
        </p>
        <p className='index__paragraph'>Enjoy, I hope you like it!</p>
      </div>
    </Layout>
  );
};

export default IndexPage;
