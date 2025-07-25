import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// Basic routes (without rate limiting)
router.route("/sender/:receiverId").post(verifyJWT, sendMessage);
router.route("/all/:senderId").get(verifyJWT, getMessage);

export default router;

/*GET - Retrieve/Read data
POST - Create new data
PUT/PATCH - Update existing data
DELETE - Remove data */
