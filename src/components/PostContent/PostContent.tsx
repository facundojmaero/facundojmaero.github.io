import * as React from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import "./PostContent.css";

const PostContent = ({ content }) => {
  return (
    <article className='post-content'>
      <MDXRenderer>{content}</MDXRenderer>;
    </article>
  );
};

export default PostContent;
