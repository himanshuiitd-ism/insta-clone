import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name:"auth",
  initialState:{
    user:null,
    suggestedUser:[],
    userProfile :null //ye bhi many places pe use hoga
  },
  reducers:{
    setAuthUser:(state,action)=>{
      state.user = action.payload
    },
    setSuggestedUser:(state,action)=>{
      state.suggestedUser = action.payload
    },
    setUserProfile:(state,action)=>{
      state.userProfile = action.payload
    }
  }
})

export const {setAuthUser,setSuggestedUser,setUserProfile} = authSlice.actions;
export default authSlice.reducer;