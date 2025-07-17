import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSideBar";
import useGetAllPost from "../hooks/useGetAllPosts";

const Home = () => {
  useGetAllPost();
  return (
    <div className="home">
      <div className="home-left">
        <Feed />
        <Outlet />
      </div>
      <div className="home-right">
        <RightSideBar />
      </div>
    </div>
  );
};

export default Home;
