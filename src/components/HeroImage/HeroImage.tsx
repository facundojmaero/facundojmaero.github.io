import * as React from "react";
import { Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import "./HeroImage.css";

const HeroImage = ({ image, imageAlt, imageLink }) => {
  return (
    <div className='hero-image'>
      <GatsbyImage image={image} alt={imageAlt} className='hero-image__image' />
      <p className='hero-image__footer'>
        <Link to={imageLink}>{imageAlt}</Link>
      </p>
    </div>
  );
};

export default HeroImage;
