import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSideBar";

const Home = () => {
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
