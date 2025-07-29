import { Server } from "socket.io";
import express from "express";
import http from "http";
import { Socket } from "dgram";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; //this map stores id corresponding to userId;jb user online aaega to isme apne aap uska id aa jata hai jisse hame pata chalega ki user online aaya hai

export const receiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User connected = UserId:${userId} , SocketId:${socket.id}`);
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //ye ek event banaega 'getOnlineUsers' naam ka jisko call krne pe userSocketMap se sara userId mil jaega
  socket.on("disconnect", () => {
    if (userId) {
      console.log(
        `User disconnected : UserId = ${userId},SocketId : ${socket.id}`
      );
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };

//index me bhi changes kea hai due to intro of socket
