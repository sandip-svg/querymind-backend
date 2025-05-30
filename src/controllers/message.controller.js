import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import {generateAIResponse} from "../services/ai.service.js"

// Create a new message
const createMessage = asyncHandler(async (req, res) => {
  const { content, metadata } = req.body;
  const { conversationId } = req.params; // Get from URL params instead
  const userId = req.user._id;

  // 1. Validate input
  if (!content?.trim()) {
    throw new ApiError(400, "Message content is required");
  }

  // 2. Verify conversation exists AND belongs to user
  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId, // Ensure the conversation belongs to requesting user
  }).select("_id"); // Only select what we need

  if (!conversation) {
    throw new ApiError(404, "Conversation not found or access denied");
  }

  // 3. Create message
  const message = await Message.create({
    userId,
    content,
    role: "user",
    conversationId,
    metadata: metadata || { type: "text" },
    status: "delivered",
  });

  // 4. Update conversation timestamp (optimized)
  await Conversation.updateOne(
    { _id: conversationId },
    { $set: { updatedAt: new Date() } }
  );

  // Trigger AI response after user message is saved
  // This will now call the updated generateAIResponse using Gemini
  generateAIResponse(conversationId, userId)
    .then((aiMessage) => {
      // Handle successful AI response (e.g., log, update UI if this were a websocket)
      if (aiMessage) {
        console.log("AI responded and saved:", aiMessage._id);
      }
    })
    .catch((error) => {
      console.error(
        `[Message Controller] Error generating AI response for conversation ${conversationId}:`,
        error
      );
      // You might want to save a "failed" AI message or notify the user
    });

  return res
    .status(201)
    .json(
      new ApiResponse(201, message, "Message created and sent successfully")
    );
});

// Edit a message
const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { newContent } = req.body;
  const userId = req.user._id;

  if (!newContent?.trim()) {
    throw new ApiError(400, "Message content cannot be empty");
  }

  const message = await Message.findOne({
    _id: messageId,
    userId,
  });
  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  // Limit edit history to last 10 edits
  if (message.editHistory.length >= 10) {
    message.editHistory.shift();
  }

  message.editHistory.push({
    content: message.content,
    editedAt: new Date(),
  });

  message.content = newContent;
  await message.save();

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Message updated successfully"));
});

// Get messages for conversation
const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId,
  });
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages retrieved successfully"));
});

// Delete message (soft delete)
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  const message = await Message.findOneAndUpdate(
    {
      _id: messageId,
      userId,
    },
    {
      $set: {
        content: "[Message deleted]",
        "metadata.type": "deleted",
        status: "deleted",
        deletedAt: new Date(),
      },
    },
    { new: true }
  );

  if (!message) {
    throw new ApiError(404, "Message not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Message deleted successfully"));
});

// Remove addReaction from exports since you removed reactions
export { createMessage, editMessage, getMessages, deleteMessage };

