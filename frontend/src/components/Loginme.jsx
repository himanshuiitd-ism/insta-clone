import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Loginme = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/");
        toast.success(res.data.message);
        setInput({
          username: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response ? error.response.data.message : "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-box">
      <form onSubmit={loginHandler}>
        <div className="signup-heading">
          <h2>Login</h2>
          <p>Login to see photos and videos from your friends</p>
        </div>
        <div className="signup-body">
          <div className="signup-body-component">
            <span className="signup-component-name">Username</span>
            <br />
            <input
              type="text"
              name="username"
              className="signup-input"
              value={input.username}
              onChange={changeEventHandler}
            />
          </div>
          <div className="signup-body-component">
            <span className="signup-component-name">Password</span>
            <br />
            <input
              type="password"
              className="signup-input"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
            />
          </div>
        </div>
        <div className="signup-button">
          <button type="submit">
            {loading ? <>Please Wait...</> : "Login"}
          </button>

          <span>
            <a href="" style={{ color: "blue", textDecoration: "none" }}>
              forgot Password ?
            </a>
          </span>
          <br />
          <span>
            Doesn't have an account?{" "}
            <a href="/signup" style={{ color: "blue", textDecoration: "none" }}>
              Signup
            </a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Loginme;
