import { IoIosChatbubbles, IoIosTrendingUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import logoImage from "./images/image.png";
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
import { useState, useEffect } from "react";
import Logout from "./Logout";

const LeftSideBar = () => {
  const { user, userProfile } = useSelector((state) => state.auth);
  const [postOpen, setPostOpen] = useState(false);
  const [logout, setLogOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { likenotification } = useSelector((state) => state.rtNotification);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const sidebarElements = [
    { name: "Home", logo: <FaHome />, tooltip: "Home" },
    { name: "Search", logo: <FaSearch />, tooltip: "Search" },
    { name: "Explore", logo: <IoIosTrendingUp />, tooltip: "Explore" },
    { name: "Messages", logo: <IoIosChatbubbles />, tooltip: "Messages" },
    { name: "Notifications", logo: <FaHeart />, tooltip: "Notifications" },
    { name: "Create", logo: <FaPlusSquare />, tooltip: "Create" },
    {
      name: "Profile",
      logo: (
        <div className="profile-photo-sidebar">
          <img
            src={user?.profilePicture?.url || logoImage}
            alt="Profile"
            onError={(e) => {
              e.target.src = logoImage;
            }}
          />
        </div>
      ),
      tooltip: "Profile",
    },
    { name: "LogOut", logo: <FaArrowAltCircleLeft />, tooltip: "Logout" },
  ];

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
    if (name === "LogOut") {
      setLogOut(true);
    } else if (name === "Create") {
      setPostOpen(!postOpen);
    } else if (name === "Profile") {
      navigate(`/${user?._id}/profile`);
    } else if (name === "Home") {
      navigate("/");
    } else if (name === "Search") {
      // Add search functionality
      console.log("Search clicked");
    } else if (name === "Explore") {
      // Add explore functionality
      console.log("Explore clicked");
    } else if (name === "Messages") {
      navigate(`/chat`);
      console.log("Messages clicked");
    } else if (name === "Notifications") {
      // Add notifications functionality
      console.log("Notifications clicked");
    }
  };

  return (
    <>
      <div className="leftSideBar">
        {/* Logo - Hidden on mobile */}
        <div className="logo">
          <img src={logoImage} alt="Logo" />
          <span>Instagram</span>
        </div>
        {/* Navigation Items */}
        <div className="leftSideBarLv1">
          {sidebarElements.map((element, index) => (
            <div
              className="leftSideBarLv2"
              onClick={() => clickHandler(element.name)}
              key={index}
              data-tooltip={element.tooltip}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  clickHandler(element.name);
                }
              }}
            >
              <span className="icon">{element.logo}</span>
              <span className="elementName">{element.name}</span>
              {/* {element.name === "Notifications" &&
                likenotification?.length > 0 && (
                  
                )} */}
            </div>
          ))}
        </div>
      </div>

      {/* Create Post Modal */}
      {postOpen && (
        <div
          className="createPost"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setPostOpen(false);
            }
          }}
        >
          <CreatePost postOpen={postOpen} setPostOpen={setPostOpen} />
        </div>
      )}

      {/* Logout Modal */}
      {logout && (
        <div
          className="createPost"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setLogOut(false);
            }
          }}
        >
          <Logout
            logout={logout}
            setLogOut={setLogOut}
            logoutHandler={logoutHandler}
          />
        </div>
      )}
    </>
  );
};

export default LeftSideBar;
