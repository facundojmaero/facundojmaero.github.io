import * as React from "react";
import { Link } from "gatsby";
import "./PostList.css";

const PostList = ({ posts }) => {
  return (
    <div className='post-list'>
      {posts.map((post) => (
        <article className='post-list__post' key={post.id}>
          <h2 className='post-list__post__title'>
            <Link to={`/blog/${post.slug}`}>{post.frontmatter.title}</Link>
          </h2>
          <div className='post-list__post__publication-date'>
            {post.frontmatter.date} - {post.fields.readingTime.text}
          </div>
        </article>
      ))}
    </div>
  );
};

export default PostList;
