import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/message/all/${selectedUser?._id}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          console.log(res.data);
          const messages = res.data.messages || res.data.data.messages || [];
          dispatch(setMessages(messages));
        }
      } catch (error) {
        console.log(error || "Something is wrong in useGetAllMessage");
        // Set empty messages on error
        dispatch(setMessages([]));
      }
    };

    fetchAllMessage();
  }, [selectedUser?._id, dispatch]);
};

export default useGetAllMessage;
