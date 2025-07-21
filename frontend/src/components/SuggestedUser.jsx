import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import image from "./images/image.png";
import useGetSuggestedUser from "../hooks/useGetSuggestedUser";

const SuggestedUser = () => {
  // Call the hook to fetch suggested users
  useGetSuggestedUser();

  const { suggestedUser } = useSelector((store) => store.auth);

  // Handle loading and empty states
  if (!suggestedUser) {
    return <div>Loading suggested users...</div>;
  }

  if (suggestedUser.length === 0) {
    return <div>No suggested users available</div>;
  }

  const buttonStyle = {
    fontSize: "12px",
    color: "rgb(0, 183, 255)",
    fontWeight: "600",
    cursor: "pointer",
    background: "none",
    border: "1px solid rgb(0, 183, 255)",
    borderRadius: "6px",
    padding: "3px 6px",
    transition: "all 0.2s ease-in-out",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: "rgb(0, 183, 255)",
    color: "white",
    transform: "translateY(-1px)",
    // boxShadow: "0 2px 8px rgba(0, 183, 255, 0.3)",
  };

  return (
    <div className="suggestedUser">
      <div className="suggestedUser-heading">
        <h1>Suggested for you</h1>
        <h2>See All</h2>
      </div>
      {suggestedUser.map((user) => {
        return (
          <div key={user._id} className="rightSideBar-sec1">
            <div className="rightSideBar-user-profile">
              <Link to={`/${user._id}/profile`}>
                <img src={user?.profilePicture?.url || image} alt="Profile" />
              </Link>
            </div>
            <div className="rightSideBar-user-detail">
              <div className="rightSideBar-user-username">
                <Link to={`/${user._id}/profile`}>{user?.username}</Link>
              </div>
              <div className="rightSideBar-user-bio">{user?.bio}</div>
            </div>
            <button
              style={buttonStyle}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, buttonHoverStyle);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, buttonStyle);
              }}
            >
              Follow
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUser;
