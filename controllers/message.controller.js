import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


export const sendMessage=asyncHandler(async(req,res)=>{
  try {
    const senderId = req.user._id
    const receiverId = req.params.receiverId
    const {message} = req.body

    if(!message){
      throw new ApiError(404,"Message not found")
    }

    let conversation = await Conversation.findOne({ //"let" just bcoz it is reasigned inside if statement
      participants:{$all:[senderId,receiverId]}
    })

    if(!conversation) {
      conversation = await Conversation.create(
        participants([senderId , receiverId])
      )
    }

    const newMessage = await Message.create({
      sender:senderId,
      receiver:receiverId,
      message:message
    })

    conversation.messages.push(newMessage)
    await Promise.all([
      newMessage.save(),
      conversation.save()
    ])

    return res
    .status(200)
    .json(
      new ApiResponse(200,newMessage,"") //hr baar send krne pe data to newMessage hi hoga na 
    ) 

  } catch (error) {
    throw new ApiError(400,error.message || "message not sent")
  }
})

export const getMessage = asyncHandler(async(req,res)=>{
  const senderId = req.params.senderId
  const receiverId = req.user._id
  const conversation = await Conversation.findOne(
    {participants:[receiverId , senderId]}
  )
  if(!conversation){
    return res
    .status(200)
    .json(
      new ApiResponse(200,[],"")
    )
  }

  return res
  .status(200)
  .json(new ApiResponse(200,conversation?.messages,""))
})