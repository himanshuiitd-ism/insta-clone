import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Image from "./images/image.png";

const NotificationBox = ({ setNotificationBox }) => {
  const { user } = useSelector((state) => state.auth);
  const { likenotification } = useSelector((state) => state.rtNotification);

  const onclickHandle = (e) => {
    e.stopPropagation();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Or for relative time (e.g., "5 minutes ago")
  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div
      className="post-modal"
      style={{ maxHeight: "50vw" }}
      onClick={onclickHandle}
    >
      <center>
        <b>Notifications</b>
      </center>
      <div
        style={{ height: "100%", overflowY: "auto" }}
        className="Notification-mainbox"
      >
        <h1>Like</h1>
        {likenotification?.map((item) => (
          <div className="Notification-peruser">
            <div>
              <Link
                to={`/${item?.userId}/profile`}
                onClick={() => setNotificationBox(false)}
              >
                <img
                  src={item?.userDetails?.profilePicture?.url || Image}
                  alt="HP"
                  style={{
                    height: "45px",
                    width: "52.5px",
                    borderRadius: "50%",
                  }}
                />
              </Link>
            </div>
            <div className="Notification-details">
              <div>
                <Link
                  to={`/${item?.userId}/profile`}
                  onClick={() => setNotificationBox(false)}
                >
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      width: "max-content",
                    }}
                  >
                    {item?.userDetails?.username}
                  </div>
                </Link>

                <div>{item?.message} 🎉</div>
              </div>

              {item?.createdAt && (
                <div style={{ fontSize: "12px", color: "gray" }}>
                  {formatRelativeTime(item.createdAt)}
                  {/* or use formatRelativeTime(item.createdAt) */}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationBox;
