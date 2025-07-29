import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["like", "comment", "follow", "mention"],
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    message: {
      type: String,
      required: true,
    },
    senderDetails: {
      username: String,
      profilePicture: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// create compound index for effecient activities

notificationSchema.index({ type: 1, senderId: 1, postId: 1, recipientId: 1 });

export const Notification = mongoose.model("Notification", notificationSchema);

/*Database has 1,000,000 notifications
Query: Find notification where type="like" AND senderId="user123" AND postId="post456"

Process:
1. Scan notification #1 ❌ (not a match)
2. Scan notification #2 ❌ (not a match) 
3. Scan notification #3 ❌ (not a match)
...
500,000. Scan notification #500,000 ✅ (FOUND!)

Result: Scanned 500,000 documents
Time: ~2-5 seconds */

/*Database has 1,000,000 notifications
Same Query with Index

Process:
1. Look up index for type="like" → Jump to section
2. Within that section, find senderId="user123" → Jump to subsection  
3. Within that subsection, find postId="post456" → Jump to exact location
4. Found in 3 steps!

Result: Scanned 1 document
Time: ~5-10 milliseconds */

/*// Uses full index
{ type: "like", senderId: "123", postId: "456", recipientId: "789" }

// Uses partial index (type + senderId)
{ type: "like", senderId: "123" }

// Uses partial index (type only)  
{ type: "like" } */

/*// Doesn't start with 'type' - can't use index efficiently
{ senderId: "123", postId: "456" }

// Skips fields - can't use index optimally
{ type: "like", postId: "456" } // skips senderId */
