import { IoIosChatbubbles, IoIosTrendingUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import logoImage from "./images/image.png"; // Relative path from component
import {
  FaHome,
  FaUser,
  FaSearch,
  FaPlusSquare,
  FaHeart,
  FaArrowAltCircleLeft,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import CreatePost from "./CreatePost";
import { useState } from "react";
const LeftSideBar = () => {
  const { user } = useSelector((state) => state.auth);
  const [postOpen, setPostOpen] = useState(false);

  const sidebarElements = [
    { name: "Home", logo: <FaHome /> },
    { name: "Search", logo: <FaSearch /> },
    { name: "Explore", logo: <IoIosTrendingUp /> },
    { name: "Messages", logo: <IoIosChatbubbles /> },
    { name: "Notifications", logo: <FaHeart /> },
    { name: "Create", logo: <FaPlusSquare /> },
    {
      name: "Profile",
      logo: (
        <div className="profile-photo-sidebar">
          <img src={user?.profilePicture.url} />
        </div>
      ),
    },
    { name: "LogOut", logo: <FaArrowAltCircleLeft /> },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "Logout failed"
      );
    }
  };

  const clickHandler = (name) => {
    if (name === "LogOut") logoutHandler();
    else if (name === "Create") setPostOpen(!postOpen);
  };
  return (
    <div className="leftSideBar">
      <div className="logo">
        <img src={logoImage} alt="Logo" />
        <span>Instagram</span>
      </div>
      <div className="leftSideBarLv1">
        {sidebarElements.map((element, index) => (
          <div
            className="leftSideBarLv2"
            onClick={() => clickHandler(element.name)}
            key={index}
          >
            <span className="icon">{element.logo}</span>
            <span className="elementName">{element.name}</span>
          </div>
        ))}
      </div>
      {postOpen && (
        <div className="createPost" onClick={() => setPostOpen(false)}>
          <CreatePost postOpen={postOpen} setPostOpen={setPostOpen} />
        </div>
      )}
    </div>
  );
};

export default LeftSideBar;
