import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "notification",
  initialState: {
    likenotification: [],
  },
  reducers: {
    setNotification: (state, action) => {
      state.likenotification = action.payload;
    },
  },
});

export const { setNotification } = rtnSlice.actions;
export default rtnSlice.reducer;

//for knowing who are online
