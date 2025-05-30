import { Router } from "express";
import { verifyJWt } from "../middlewares/auth.middleware.js";
import { checkVerified } from "../middlewares/checkVerified.middleware.js";
import {
  createMessage,
  getMessages,
  editMessage,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = Router();

router
  .route("/create-message/:conversationId")
  .post(verifyJWt, checkVerified, createMessage);
router
  .route("/get-message/:conversationId")
  .get(verifyJWt, checkVerified, getMessages);
router
  .route("/edit-message/:messageId")
  .patch(verifyJWt, checkVerified, editMessage);
router
  .route("/delete-message/:messageId")
  .delete(verifyJWt, checkVerified, deleteMessage);

export default router;
