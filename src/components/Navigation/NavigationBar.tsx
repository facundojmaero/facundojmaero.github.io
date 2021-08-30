import * as React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";

import { FaPiedPiperHat } from "react-icons/fa";

import "./NavigationBar.css";

const NavigationBar = () => {
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  const activeClassName = "navigation-bar__link--active";

  return (
    <header className='navigation-bar'>
      <Link to='/' className='navigation-bar__title'>
        <FaPiedPiperHat
          size='50'
          className='navigation-bar__title__profile-picture'
        />
        {/* <div className='navigation-bar__title__profile-picture'>
          <FaPiedPiperHat size='50' />
        </div> */}
        <p className='navigation-bar__title__name'>
          {data.site.siteMetadata.title}
        </p>
      </Link>

      <nav>
        <Link
          to='/blog'
          className='navigation-bar__link'
          activeClassName={activeClassName}
        >
          Blog
        </Link>
        <Link
          to='/about'
          className='navigation-bar__link'
          activeClassName={activeClassName}
        >
          About
        </Link>
      </nav>
    </header>
  );
};

export default NavigationBar;
