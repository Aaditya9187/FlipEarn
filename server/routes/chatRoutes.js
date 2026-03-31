import express from "express";
import { protect } from "../middlewares/authMiddlewares.js";
import { getAllUserChats, getChat, sendChatMessage } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/", protect, getChat)
chatRouter.get("/user", protect, getAllUserChats)
chatRouter.post("/send-message", protect, sendChatMessage)

export default chatRouter;