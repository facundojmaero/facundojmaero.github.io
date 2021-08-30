import * as React from "react";
import Layout from "../../components/Layout/Layout";
import { graphql } from "gatsby";
import PostList from "../../components/PostList/PostList";

const BlogPage = ({ data }) => {
  return (
    <Layout pageTitle='My Blog Posts'>
      <PostList posts={data.allMdx.nodes} />
    </Layout>
  );
};

export const query = graphql`
  {
    allMdx(sort: { order: DESC, fields: frontmatter___date }) {
      nodes {
        frontmatter {
          title
          date(formatString: "MMMM D, YYYY")
        }
        id
        slug
        fields {
          readingTime {
            text
          }
        }
      }
    }
  }
`;

export default BlogPage;
