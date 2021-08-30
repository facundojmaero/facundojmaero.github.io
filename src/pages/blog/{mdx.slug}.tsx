import * as React from "react";
import Layout from "../../components/Layout/Layout";
import { graphql } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import PostHeader from "../../components/PostHeader/PostHeader";
import PostContent from "../../components/PostContent/PostContent";
import HeroImage from "../../components/HeroImage/HeroImage";

const BlogPost = ({ data }) => {
  const image = getImage(data.mdx.frontmatter.hero_image);

  return (
    <Layout pageTitle={data.mdx.frontmatter.title}>
      <PostHeader
        pageTitle={data.mdx.frontmatter.title}
        publishDate={data.mdx.frontmatter.date}
        readingTime={data.mdx.fields.readingTime.text}
      />
      {image && (
        <HeroImage
          image={image}
          imageAlt={data.mdx.frontmatter.hero_image_alt}
          imageLink={data.mdx.frontmatter.hero_image_credit_link}
        />
      )}
      <PostContent content={data.mdx.body} />
    </Layout>
  );
};

export const query = graphql`
  query ($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date(formatString: "MMMM D, YYYY")
        hero_image_alt
        hero_image_credit_link
        hero_image {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      body
      fields {
        readingTime {
          text
        }
      }
    }
  }
`;

export default BlogPost;
