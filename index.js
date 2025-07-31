import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import notificationRoutes from "./routes/notification.route.js";
import { app, server } from "./socket/socket.js";

dotenv.config({});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "I'm on backend",
    success: true,
  });
});

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173", // Allow your frontend origin
    credentials: true, // Allow credentials
  })
);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/notifications", notificationRoutes);
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server listining at port: ${PORT}`);
});
