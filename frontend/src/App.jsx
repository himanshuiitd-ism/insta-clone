import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import SignUp from "./components/Signup";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Loginme from "./components/Loginme";
import Profile from "./components/Profile";

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
        path: "/profile",
        element: <Profile />,
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
  return <RouterProvider router={browserRouter} />;
}

export default App;
