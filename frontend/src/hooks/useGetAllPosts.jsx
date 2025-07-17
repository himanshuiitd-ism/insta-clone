import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPosts } from "../redux/postSlice";
import axios from "axios";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/post/posts", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setPosts(res.data.data));
          console.log(res.data.data);
        }
      } catch (error) {
        console.log("The error is :", error);
      }
    };
    fetchAllPost();
  }, []);
};

export default useGetAllPost;
