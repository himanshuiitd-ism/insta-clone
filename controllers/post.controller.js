import sharp from "sharp";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

export const post = asyncHandler(async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.user._id;

    if (!image) throw new ApiError(400, "Image required");

    // Optimize image
    const optimizedBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload to Cloudinary
    const cloudResponse = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${optimizedBuffer.toString('base64')}`
    );

    // Create post
    const createdPost = await Post.create({
      caption,
       image: {
        url: cloudResponse.secure_url,
        publicId: cloudResponse.public_id
      },
      author: authorId
    });

    // Update user's posts array
    await User.findByIdAndUpdate(
      authorId,
      { $push: { posts: createdPost._id } },
      { new: true }
    );

    // Populate author details
    const populatedPost = await Post.findById(createdPost._id)
      .populate('author', '-password');

    return res
      .status(201)
      .json(new ApiResponse(201, populatedPost, "Post created successfully"));

  } catch (error) {
    throw new ApiError(400, error.message || "Post creation failed");
  }
});

//all post (mainly on home screen)
// In post.controller.js
export const getPost = asyncHandler(async(req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'author',
        select: 'username profilePicture' // lowercase 'select'
      })
      .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'author',
          select: 'username profilePicture'
        }
      });

    if (!posts || posts.length === 0) {
      return res.status(200).json(
        new ApiResponse(200, [], "No posts found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, posts, "Posts fetched successfully")
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new ApiError(500, error.message || "Error fetching posts");
  }
});
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
      const postId=req.params.postId //params ke baad wahi name do jo router me ":" iske baad dea ho
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
    console.log(error)
      throw new ApiError(400,error.message || "like unlike failed")
    }
})

//add comment ke lea ye use krna hai
export const addComment = asyncHandler(async(req,res)=>{
try {
    const postId=req.params.postId //params ke baad wahi name do jo router me ":" iske baad dea ho
    const commentKrneWaleKiId=req.user._id
    const { text } = req.body

    if(!text){
      throw new ApiError(400,"text is required")
    }

    const post=await Post.findById(postId)
    if(!post){
      throw new ApiError(404,"Post not found")
    }

    const comment = await Comment.create({
      text,
      author:commentKrneWaleKiId,
      post:postId
    })
    const populatedComment = await Comment.findById(comment._id).populate(
      {
      path:'author',
      select:'username profilePicture'
      }
    )

    post.comments.push(comment._id)
    await post.save()

    return res
    .status(200)
    .json(new ApiResponse(200,populatedComment,"Comment added"))
  } catch (error) {
      throw new ApiError(400,error.message)
  }
})

//now get comments according to posts 
export const getCommentsAccordingToPost=asyncHandler(async(req,res)=>{ //isme bhi sort laga dena to arrange all comment
  try {
    const postId=req.params.postId //params ke baad wahi name do jo router me ":" iske baad dea ho

    const commentsOnThatPost = await Comment.find({post:postId}).sort({createdAt:-1})
    .populate({
      path:'author',
      select:'username profilePicture'
    }) //ye sara comments user ko getUserPost and getPost me mil jaega hm bs sara ek post pr wala comments ek jagah la ke rkh dea hai (it's like ki getUserPost and getPost ko commet se populate(connect) kr do and comment ko sara same postid wale comment se populate kr do)

    //iska mtlb hai un sare comment ko find kro jinka post me id postid ke equal hai aur wo equal hoga kyu ki ref dea hua hai

    if (!commentsOnThatPost || commentsOnThatPost.length === 0) {
      throw new ApiError(400, "No comments yet");
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
    const postId=req.params.postId //params ke baad wahi name do jo router me ":" iske baad dea ho "hamko dena hai"
    const commentKrneWaleKiId=req.user._id //ye dena nahi hai ye automatically check hoga 
    const {commentId}=req.body //ye hamko dena hai

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

export const deletePost=asyncHandler(async(req,res)=>{
  try {
    const postId = req.params.postId //params ke baad wahi name do jo router me ":" iske baad dea ho
    const userId = req.user._id
    const post = await Post.findOne({_id:postId ,author:userId})
    if(!post){
      throw new ApiError(404,"Post not found or unotharised")
    }
    await post.deleteOne({_id:postId}); // Fixed: Use `deleteOne` on the Model, not the instance


    await User.findByIdAndUpdate(
      userId,
      {
        $pull:{posts:postId}
      },
      {new:true} //this works same as user.save()
    )
    
    await Comment.deleteMany({post:postId})

    return res
    .status(200)
    .json(
      new ApiResponse(200,{},"Post deleted")
    )
  } catch (error) {
    throw new ApiError( error.statusCode || 500,
      error.message || "Post deletion failed")
  }
})

export const bookMarkPost = asyncHandler(async(req,res)=>{
  try{
  const userId = req.user._id
  const postId = req.params.postId //params ke baad wahi name do jo router me ":" iske baad dea ho

  if (!mongoose.isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }
  const post = await Post.findById(postId)
  if(!post){
    throw new ApiError(404,"Post not found")
  }

  const user = await User.findById(userId)
  const isBookmarked = user.bookmarks.includes(postId)

  if (isBookmarked){
    user.bookmarks=user.bookmarks.filter(id => id.toString() !== postId.toString())
    // I used this "user.bookmarks=" bcoz hame purane bookmark ko hata ke usme new bookmark daalna padega na  
  }else{
    user.bookmarks.push(postId)
  }

  await user.save()

  return res
  .status(200)
  .json(new ApiResponse(200,{},isBookmarked ? "Removed from bookmarks" : "Added to bookmarks" ))
  } catch (error) {
    throw new ApiError(error.statusCode, error.message || "bookmarke failed")
  }
})
