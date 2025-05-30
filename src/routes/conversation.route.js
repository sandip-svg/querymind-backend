import { Router } from "express";
import { verifyJWt } from "../middlewares/auth.middleware.js";
import { checkVerified } from "../middlewares/checkVerified.middleware.js";
import {
  createConversation,
  getUserConversations,
  getConversationById,
  updateConversationTitle,
  deleteConversation,
  clearAllConversations,
} from "../controllers/conversation.controller.js";

const router = Router();

router
  .route("/create-conversation")
  .post(verifyJWt, checkVerified, createConversation);
router
  .route("/get-conversations")
  .get(verifyJWt, checkVerified, getUserConversations);
router
  .route("/get-conversations/:conversationId")
  .get(verifyJWt, checkVerified, getConversationById);
router
  .route("/update-conversions-title/:conversationId")
  .patch(verifyJWt, checkVerified, updateConversationTitle);
router
  .route("/delete-conversions/:conversationId")
  .delete(verifyJWt, checkVerified, deleteConversation);
router
  .route("/clear-all-conversions")
  .delete(verifyJWt, checkVerified, clearAllConversations);

export default router;
