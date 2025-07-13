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
const LeftSideBar = () => {
  const sidebarElements = [
    { name: "Home", logo: <FaHome /> },
    { name: "Search", logo: <FaSearch /> },
    { name: "Explore", logo: <IoIosTrendingUp /> },
    { name: "Messages", logo: <IoIosChatbubbles /> },
    { name: "Notifications", logo: <FaHeart /> },
    { name: "Create", logo: <FaPlusSquare /> },
    { name: "Profile", logo: <FaUser /> },
    { name: "LogOut", logo: <FaArrowAltCircleLeft /> },
  ];

  const navigate = useNavigate();
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
    </div>
  );
};

export default LeftSideBar;
