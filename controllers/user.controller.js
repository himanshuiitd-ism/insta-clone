import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import getDataUri from "../utils/datauri.js";

const generateAccessAndRefreshToken=async (userId)=>{
  try {
    const user =await User.findById(userId)
  
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
  
    user.refreshToken=refreshToken
  
    await user.save({validateBeforeSave:false})
  
    return {accessToken,refreshToken}
  } catch (error) {
      console.error("Token generation error:", error); 
      throw new ApiError(500, "Something went wrong while generating tokens");
  }

}

export const register= asyncHandler(async(req,res)=>{
  const {username,email,password}=req.body

  if([username,password,email].some((field)=>field.trim()==="")){
    throw new ApiError(400,'please provide required field')
  }

  const ifUserExist=await User.findOne({
    $or:[{username},{email}]
  })

  if(ifUserExist){
    throw new ApiError(400,"User with this email or username already exists")
  }

  const user=await User.create({
    username:username.toLowerCase(),
    email,
    password
  })

  const createdUser=await User.findById(user._id).select("-password")

  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering user")
  }

  return res
  .status(200)
  .json(new ApiResponse(201,createdUser,"User created successfully"))
})

export const login=asyncHandler(async(req,res)=>{

  const {username,password}=req.body

  if([username,password].some((item)=>item.trim()==="")){
    throw new ApiError(400,"Enter both usernmae and password")
  }

  //username and password check

  const user=await User.findOne({username})
  if(!user){
    throw new ApiError(400,"User doesn't exists")
  }

  const passwordVerification=await user.isPasswordcorrect(password)

  if(!passwordVerification){
    throw new ApiError(400,"Please enter correct password")
  }

  //cookies generation

  const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id) //after this User got refreshed

  const logedInUser=await User.findById(user._id).select("-password -refreshToken")

  const options={
    httpOnly:true,
    secure:true
  }

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user:logedInUser,
        accessToken,
        refreshToken
      },
      "User login succesfull"
    )
  )
})

export const logout = asyncHandler(async(_ , res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset:{
        refreshToken:1
      }
    },
    {
      new:true
    }
  )
  const options={
    httpOnly:true,
    secure:true
  }
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(200,{},"Logout Successfully")
  )
})

export const getProfile=asyncHandler(async(req,res)=>{
try {
    const userId=req.params._id
    if(!userId){
      throw new ApiError(400,"User is not valid")
    }
    const userProfile=await User.findById(userId).select("-password -refreshToken")
    if(!userProfile){
      throw new ApiError(400,"User not found")
    }
    return res
    .status(200)
    .json(
      new ApiResponse(200,userProfile,"")
    )
} catch (error) {
  console.log("Someting is wrong in line 132 to 142 :",error)
}
})

export const editProfile=asyncHandler(async(req,res)=>{
  try {
    const userId=req.user._id
    const {bio,gender} = req.body
    const profilePicture=req.field
    let cloudResponse;

    if(profilePicture){
      const fileUri= getDataUri(profilePicture)
    }
  } catch (error) {
    
  }
})