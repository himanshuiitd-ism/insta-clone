import sharp from "sharp";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const post=asyncHandler(async(req,res)=>{
 try {
   const {caption}=req.body
   const image=req.file
   const authorId=req.user._id
 
   if(!image) throw new ApiError(404,"Image required")
 
   //this part is for image uploding ,image may be of large size so we use sharp lib to reduce the size of image  
 
   const optimizedBufferImage=await sharp(image.buffer)
   .resize({width:800,height:800,fit:'inside'})
   .toFormat('jpeg' , {quality:80})
   .toBuffer()
   //buffer to datauri
   const fileUri=`data:image/jpeg;base64,${optimizedBufferImage.toString('base64')}`
 
   //fileUri ko cloudinary pe upload kr do
   const cloudResponse = await cloudinary.uploader.upload(fileUri)
 
   const post = Post.create({
     caption,
     image:cloudResponse.secure_url,
     author:authorId
   })
   
   //now we need to show all user this created post so we need to push this in user.schema.js
   const user=User.findById(authorId)
   if(user){
     //pura maal daal ke space bharne se aacha hai id push kr de bs aur baad me ui ke lea post se le lena id match kr ke
     user.posts.push(post_id)
     //for updated data we use save()
     //user ka post update kr do
     await user.save()
   }
 
   // Replaces ObjectIds with full Post documents and for this we use populate method
 
   await post.populate({
     path:'author',
     Select:"-password"
   })
 
   return res
   .status(200)
   .json(
     new ApiResponse(200,post,"Post created successfully")
   )
 } catch (error) {
    throw new ApiError(400,error.message || "Post creation failed")
 }
})

//all post (mainly on home screen)
export const getPost=asyncHandler(async(req,res)=>{
  try {
    const posts = await Post.find().sort({createdAt:-1})
    .populate(
      {
        path:'author', //author user see hi populate hoga bina nested populate kea hue
        Select:'username , profilePicture' //user me se inko use kr ke hi populate krna
      }
    )
    .populate(
      {
        path:'comments',
        sort:{createdAt:-1},
        populate:{
          path:'author',
          Select:'username , profilePicture'
        }
      }
    )
    return res
    .status(200)
    .json(
      new ApiResponse(200,posts,"")
    )
  } catch (error) {
    throw new ApiError(400,"No posts available")
  }
})

//only my post on my profile page 
export const getUserPost=asyncHandler(async(req,res)=>{
  try {
    const authorId=req.user._id
    const posts = await Post.find({author:authorId}).sort({createdAt:-1})
    .populate(
        {
          path:'author', //author user see hi populate hoga bina nested populate kea hue
          Select:'username , profilePicture' //user me se inko use kr ke hi populate krna
        }
      )
      .populate(
        {
          path:'comments',
          sort:{createdAt:-1},
          populate:{
            path:'author',
            Select:'username , profilePicture'
          }
        }
      )
    //findbyId me Post ka id lagta but hame user ke id se dhundhna hai jo ki author section in post ka id hoga
    return res
    .status(200)
    .json(
      new ApiResponse(200,posts,"")
    )
  } catch (error) {
    console.log("Error in getUserPost : ",error.message)
  }
})

export const likeDislike=asyncHandler(async(req,res)=>{
  try {
      const likeKrneWaleKiId=req.user._id
      const postId=req.params._id //isse post ka id milega na ki post daalne wale user ka
      const post = await Post.findById(postId)
      if(!post){
        throw new ApiError(400,"Post not found")
      }
      const isLiked = post.likes.includes(likeKrneWaleKiId)
    //   if (isLiked) {
    //   await Post.updateOne({ _id: postId }, { $pull: { likes: likeKrneWaleKiId } });
    // } else {
    //   await Post.updateOne({ _id: postId }, { $push: { likes: likeKrneWaleKiId } });
    // }
    
    //better way
      const updatedPost=await Post.findByIdAndUpdate(
        postId,
        isLiked ? { $pull: { likes: likeKrneWaleKiId } } : { $push: { likes: likeKrneWaleKiId } },
        {new:true}
      )

      return res
      .status(200)
      .json(new ApiResponse(200, updatedPost , isLiked? "Unliked" : "Liked"))
  } catch (error) {
      throw new ApiError(400,error.messgae || "like unlike failed")
    }
})

//add comment ke lea ye use krna hai
export const addComment = asyncHandler(async(req,res)=>{
try {
    const postId=req.params._id
    const commentKrneWaleKiId=req.user._id
    const {text} = req.body
    if(!text){
      throw new ApiError(400,"text is required")
    }
    const post=await Post.findById(postId)
    const comment = await Comment.create({
      text,
      author:commentKrneWaleKiId,
      post:postId
    }).populate({
      path:'author',
      Select:'username , profilePicture'
    })
  
    post.comments.push(comment)
    await post.save()
    return res
    .status(200)
    .json(new ApiResponse(200,comment,"Comment added"))
  } catch (error) {
      throw new ApiError(400,"Comment not added")
  }
})

//now get comments according to posts 
export const getCommentsAccordingToPost=asyncHandler(async(req,res)=>{
  try {
    const postId=req.params._id

    const commentsOnThatPost = await Comment.find({post:postId}).populate({
      path:'author',
      Select:'username , profilePicture'
    }) //ye sara comments user ko getUserPost and getPost me mil jaega hm bs sara ek post pr wala comments ek jagah la ke rkh dea hai (it's like ki getUserPost and getPost ko commet se populate(connect) kr do and comment ko sara same postid wale comment se populate kr do)

    //iska mtlb hai un sare comment ko find kro jinka post me id postid ke equal hai aur wo equal hoga kyu ki ref dea hua hai

    if(!commentsOnThatPost){
      throw new ApiError(400,"No comments yet")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,commentsOnThatPost,""))
  } catch (error) {
    throw new ApiError(400,error.message)
  }
})


//In MongoDB and Mongoose, findOne() means: "Find the first document that matches ALL of the specified criteria"
export const deleteComment= asyncHandler(async(req,res)=>{
  try {
    const postId=req.params._id
    const commentKrneWaleKiId=req.user._id
    const {commentId}=req.body

    // Validate required fields
    if (!commentId) {
      throw new ApiError(400, "Comment ID is required");
    }

    const comment=await Comment.findOne({
      _id:commentId,
      author:commentKrneWaleKiId,
      post:postId
    })

    if(!comment){
      throw new ApiError(404,"Comment not find")
    }
    
    await Comment.deleteOne({_id:commentId})

    // Remove comment reference from the post (neccessary bcoz ref khud se delete thori hoga)
    await Post.findByIdAndUpdate(
      postId,
      {$pull:{comments:commentId}},
      {new:true}
    );
    return res
    .status(200)
    .json(
      new ApiResponse(200,{},"Deletion Successfull")
    )
  } catch (error) {
    throw new ApiError(400,"Comment deletion failed")
  }
})