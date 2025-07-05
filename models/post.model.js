import mongoose , {Schema} from "mongoose";

const postSchema=new Schema(
  {
    caption:{
      type:String,
      default:''
    },
    image:{
      type:String,
      required:true, //1post have 1 image 
    },
    author:{
      type:Schema.Types.ObjectId,
      ref:'User',
      required:true
    },
    likes:[{
      type:Schema.Types.ObjectId,
      ref:'User'
    }],
    comment:[
      {
        type:Schema.Types.ObjectId,
        ref:'Comment'
      }
    ]
  },
  {
    timestamps:true
  }
)

export const Post=mongoose.model('Post',postSchema)