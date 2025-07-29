import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "notification",
  initialState: {
    likenotification: [], // All notifications (seen + unseen)
    unseenCount: 0, // Count of unseen notifications only
  },
  reducers: {
    setNotification: (state, action) => {
      const { type, userId, postId } = action.payload;

      if (type === "like") {
        // Add like notification
        state.likenotification.unshift(action.payload);
        state.unseenCount += 1; // Increment unseen count
      } else if (type === "dislike") {
        // Remove like notification
        const removedNotification = state.likenotification.find(
          (item) => item.userId === userId && item.postId === postId
        );

        state.likenotification = state.likenotification.filter(
          (item) => !(item.userId === userId && item.postId === postId)
        );

        // Only decrement if the removed notification was unseen
        if (removedNotification) {
          state.unseenCount = Math.max(0, state.unseenCount - 1);
        }
      }
    },
    clearNotification: (state, action) => {
      const { userId, postId } = action.payload;
      const removedNotification = state.likenotification.find(
        (item) => item.userId === userId && item.postId === postId
      );

      state.likenotification = state.likenotification.filter(
        (item) => !(item.userId === userId && item.postId === postId)
      );

      if (removedNotification) {
        state.unseenCount = Math.max(0, state.unseenCount - 1);
      }
    },
    clearAllNotifications: (state) => {
      state.likenotification = [];
      state.unseenCount = 0;
    },
    markAllAsSeen: (state) => {
      // Keep notifications but reset unseen count
      state.unseenCount = 0;
    },
  },
});

export const {
  setNotification,
  clearAllNotifications,
  clearNotification,
  markAllAsSeen,
} = rtnSlice.actions;

export default rtnSlice.reducer;
