import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { getContactHref, getIcon } from "./utils";
import "./Footer.css";

const Footer = () => {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            author {
              contacts {
                email
                github
                linkedin
                resume
              }
            }
          }
        }
      }
    `
  );

  const contacts = data.site.siteMetadata.author.contacts;

  return (
    <footer className='footer'>
      <h3 className='footer__title'>Links</h3>
      <ul className='footer__link-list'>
        {Object.keys(contacts).map((name, i) => {
          const Icon = getIcon(name);

          return (
            <li className='footer__link-list__item' key={i}>
              <a
                className='footer__link-list__item-link'
                href={getContactHref(name, contacts[name])}
                title={name[0].toUpperCase() + name.slice(1)}
              >
                <Icon size='32' />
              </a>
            </li>
          );
        })}
      </ul>
      <p className='footer__credit'>
        Built with <a href='https://www.gatsbyjs.com'>Gatsby</a>
      </p>
    </footer>
  );
};

export default Footer;
