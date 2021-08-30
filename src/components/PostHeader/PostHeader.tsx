import * as React from "react";
import "./PostHeader.css";

const PostHeader = ({ pageTitle, publishDate, readingTime }) => {
  return (
    <div className='post-header'>
      <h1 className='post-header__post-title'>{pageTitle}</h1>
      <p className='post-header__publish-data'>
        {publishDate} ⋅ {readingTime}
      </p>
    </div>
  );
};

export default PostHeader;
