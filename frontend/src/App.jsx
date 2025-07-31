import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import SignUp from "./components/Signup";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Loginme from "./components/Loginme";
import Profile from "./components/Profile";
import { cleanupInvalidData } from "./utils/cleanup";
import { useEffect } from "react";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setNotification } from "./redux/rtnSlice";
import ProtectedApp from "./components/ProtectedApp";
import useGetUnreadCount from "./hooks/useNotification";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedApp>
        <MainLayout />
      </ProtectedApp>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedApp>
            <Home />
          </ProtectedApp>
        ),
      },
      {
        path: "/:id/profile",
        element: (
          <ProtectedApp>
            <Profile />
          </ProtectedApp>
        ),
      },
      {
        path: "/account/edit",
        element: (
          <ProtectedApp>
            <EditProfile />
          </ProtectedApp>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedApp>
            <ChatPage />
          </ProtectedApp>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Loginme />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const { socket /*yaha initial state ka name likhna hota hai */ } =
    useSelector((store) => store.socketio);
  const { allNotification } = useSelector((store) => store.rtNotification);
  const dispatch = useDispatch();

  useEffect(() => {
    // Clean up invalid data when app starts
    cleanupInvalidData();
  }, []);

  useGetUnreadCount();
  console.log("All Notifications:", allNotification);

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8000", {
        query: { userId: user._id },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      // Add connection event listeners
      socketio.on("connect", () => {
        console.log("✅ Socket connected successfully:", socketio.id);
      });

      socketio.on("disconnect", (reason) => {
        console.log("❌ Socket disconnected:", reason);
      });

      socketio.on("connect_error", (error) => {
        console.error("🚫 Socket connection error:", error);
      });

      // Listen for online users
      socketio.on("getOnlineUsers", (onlineUsers) => {
        console.log("👥 Online users received:", onlineUsers);
        dispatch(setOnlineUsers(onlineUsers));
      });

      // Listen for notifications
      socketio.on("notification", (notification) => {
        console.log("🔔 Real-time notification received:", notification);
        dispatch(setNotification(notification));
      });

      return () => {
        console.log("🧹 Cleaning up socket connection");
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      console.log("🧹 User logged out, closing socket");
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
