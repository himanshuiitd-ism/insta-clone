import mongoose , {Schema} from "mongoose";
//ye pura chat section ka msg save krne ke lea hai

const conversationSchema=new Schema(
  {
    participants:[
      {
        type:Schema.Types.ObjectId,
        ref:'User'
      }
    ],
    messages:[
      {
        type:Schema.Types.ObjectId,
        ref:'Message'
      }
    ]
  },
  {
    timestamps:true
  }
)

export const Conversation=mongoose.model('Conversation',conversationSchema)