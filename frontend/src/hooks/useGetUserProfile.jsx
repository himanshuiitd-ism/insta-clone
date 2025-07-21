import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserProfile } from "../redux/authSlice";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/user/${userId}/profile`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setUserProfile(res.data.data));
          console.log(res.data.data);
        }
      } catch (error) {
        console.log("The error is :", error);
      }
    };
    fetchUserProfile();
  }, [userId]);
};

export default useGetUserProfile;
