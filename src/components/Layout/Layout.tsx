import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";

import NavigationBar from "../Navigation/NavigationBar";
import Footer from "../Footer/Footer";

import "./Layout.css";

const Layout = ({ pageTitle, children }) => {
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <div className='container'>
      <title>
        {pageTitle} | {data.site.siteMetadata.title}
      </title>
      <NavigationBar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
