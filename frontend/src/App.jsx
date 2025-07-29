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

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/:id/profile",
        element: <Profile />,
      },
      {
        path: "/account/edit",
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
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
  const dispatch = useDispatch();

  useEffect(() => {
    // Clean up invalid data when app starts
    cleanupInvalidData();
  }, []);

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8000", {
        query: { userId: user._id },
        transports: ["websocket"], //to prevent multiple API call
      });
      dispatch(setSocket(socketio));

      //Listen all events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        //yha se saara oline users mil jaega usko setonlineusers me pass kr do
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setNotification(notification)); //store ke paas notification aa jaega agr socket me notification hoga and yaha app rerender hoga
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
