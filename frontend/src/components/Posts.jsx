import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  // Correct the state path to match your Redux structure
  const posts = useSelector((state) => state.post.posts);

  // Add a safeguard in case posts is undefined
  if (!posts) {
    return <div>Loading posts...</div>; // or null, or a loading spinner
  }
  const validPosts = posts?.filter((post) => post?._id) || [];

  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
