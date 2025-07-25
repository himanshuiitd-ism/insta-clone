import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import image from "./images/image.png";
import { setSelectedUser } from "../redux/authSlice";
import { IoMdCall } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";

const ChatPage = () => {
  const { user, selectedUser } = useSelector((store) => store.auth);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noFollowing, setNoFollowing] = useState(false);
  const dispatch = useDispatch();

  //when page is refreshed selecteduser bcom null
  useEffect(() => {
    // dispatch(resetSelectedUser(null));
    dispatch(setSelectedUser(null));
  }, []);

  useEffect(() => {
    const fetchFollowingUser = async () => {
      if (!user?.following?.length) {
        setLoading(false);
        setNoFollowing(true); //this is to display message
        return;
      }

      try {
        const userDetailsPromise = user.following.map((userId) =>
          axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`, {
            withCredentials: true,
          })
        );

        // Use allSettled to handle individual failures gracefully
        const responses = await Promise.allSettled(userDetailsPromise);

        // Extract successful responses and log failed ones
        const followingUserData = responses
          .filter((result, index) => {
            if (result.status === "rejected") {
              console.log(
                `Failed to fetch user ${user.following[index]}:`,
                result.reason
              );
              return false;
            }
            // Fixed: Check for result.value.data.data instead of result.value.data.user
            return result.value?.data?.data;
          })
          // Fixed: Extract user data from result.value.data.data
          .map((result) => result.value.data.data);

        console.log("followingUserData", followingUserData);

        const chatableUser = followingUserData.filter((userData) => {
          // Safety checks
          if (!userData || !userData._id) return false;

          if (!userData.privacy) {
            return true;
          } else if (
            userData.privacy &&
            userData.following?.includes(user._id)
          ) {
            return true;
          }
          return false;
        });

        //now we want those user with whom I last chated or who send me msg latest

        const userWithLastMessage = await Promise.allSettled(
          chatableUser.map(async (userData) => {
            try {
              const messageResponse = await axios.get(
                `http://localhost:8000/api/v1/message/all/${userData._id}`,
                { withCredentials: true }
              ); //isme bahut kuch aaega usme se messages array nikalna hai
              console.log("messageResponse.data", messageResponse.data);
              const messages =
                messageResponse?.data?.data?.messages ||
                messageResponse?.data?.messages || //baad me wala messages convo.schema wala messages array hai
                [];

              const lastMessage =
                messages.length > 0 ? messages[messages.length - 1] : null;

              const lastMessageTime = lastMessage?.createdAt || null;

              console.log(
                `Messages for ${userData.username}:`,
                messages.length
              );
              console.log(
                `Last message time for ${userData.username}:`,
                lastMessageTime
              );

              return {
                ...userData,
                lastMessageTime: lastMessageTime,
                messageCount: 0,
              };
            } catch (error) {
              console.log(
                `No chat history found for user ${userData.username}:`,
                error.response?.data?.message || error.message
              );
              return {
                ...userData,
                lastMessageTime: null,
                messageCount: 0,
              };
            }
          })
        ); //this gives us last messagetime of every user present in my chat sec.

        //Extract successful result and handling failure
        const userWithChatData = userWithLastMessage
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value); //userWithChatData me sb ke userwithlastmessage me se sari values store ho gae hai.

        // Sort by last message time (most recent first)
        // Users with no chat history will appear at the bottom
        const sortedUsers = userWithChatData.sort((a, b) => {
          // If both have message times, sort by most recent
          if (a.lastMessageTime && b.lastMessageTime) {
            return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
          }
          // If only a has message time, a comes first
          if (a.lastMessageTime && !b.lastMessageTime) {
            return -1;
          }
          // If only b has message time, b comes first
          if (!a.lastMessageTime && b.lastMessageTime) {
            return 1;
          }
          // If neither has message time, sort by user updatedAt
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

        console.log("Sorted users with chat data:", sortedUsers);
        setAvailableUsers(sortedUsers);
      } catch (error) {
        console.log("Error in fetching following users: ", error);
        toast.error(error.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowingUser();
  }, [user]);

  const isOnline = false;
  console.log("selectedUser is ", selectedUser);

  return (
    <div className="ChatPage" style={{ marginLeft: "19vw" }}>
      <div className="ChatPageSec1">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            paddingBottom: "10px",
            borderBottom: "2px solid #8e8e8e",
            paddingLeft: "10px",
          }}
        >
          <img src={user.profilePicture?.url || image} alt="profilePhoto" />
          <h1>{user?.username}</h1>
        </div>

        {availableUsers.map((followedUser) => {
          return (
            <div
              onClick={() => dispatch(setSelectedUser(followedUser))}
              className="chatPageUser"
              key={followedUser._id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
                padding: "5px ",
                paddingLeft: "10px",
                borderRadius: "4px",
              }}
            >
              <img
                src={followedUser.profilePicture?.url || image}
                alt="profilePhoto"
              />
              <div className="userNameBox-ChatPage">
                <p>{followedUser.username}</p>
                {isOnline ? (
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      color: "rgb(129, 214, 0)",
                    }}
                  >
                    Online
                  </p>
                ) : (
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      color: "red",
                    }}
                  >
                    Offline
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="ChatPageSec2">
        {selectedUser ? (
          <div className="ChatPageSec2-container">
            <div className="ChatPageSec2-heading" style={{ display: "flex" }}>
              <img src={selectedUser?.profilePicture?.url || image} alt="HP" />
              <p>{selectedUser?.username}</p>
              <div className="ChatPageSec2-icons">
                <div className="ChatPageSec2-icon">
                  <IoMdCall />
                </div>
                <div className="ChatPageSec2-icon">
                  <BsThreeDots />
                </div>
              </div>
            </div>
            <div className="ChatPageSec2-middle">I am the king</div>
            <input
              type="text"
              placeholder="They are waiting for your presence..."
              className="ChatPageSec2-input"
            />
          </div>
        ) : (
          <h1>I am not</h1>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
