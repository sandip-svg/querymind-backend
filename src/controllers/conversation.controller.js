import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

const createConversation = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const userId = req.user?._id;

  const conversation = await Conversation.create({
    userId,
    title: title || "New Chat",
  });

  if (!conversation) {
    throw new ApiError(500, "Failed to create conversation");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, conversation, "Conversation created successfully"),
    );
});

const getUserConversations = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const conversations = await Conversation.find({ userId })
    .sort({ updatedAt: -1 }) // Most recently updated first
    .select("-__v"); // Exclude version key

  if (!conversations) {
    throw new ApiError(404, "Conversation not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        conversations,
        "Conversations retrieved successfully",
      ),
    );
});

const getConversationById = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user?._id;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId,
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, conversation, "Conversation retrieved successfully"),
    );
});

const updateConversationTitle = asyncHandler(async (req, res) => {
  const conversationId = req.params.conversationId;
  const { title } = req.body;
  const userId = req.user?._id;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const conversation = await Conversation.findOneAndUpdate(
    {
      _id: conversationId,
      userId,
    },
    {
      $set: { title },
    },
    { new: true },
  );

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        conversation,
        "Conversation title updated successfully",
      ),
    );
});

const deleteConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user?._id;

  // First verify the conversation belongs to the user
  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId,
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  // Delete all messages in this conversation first
  await Message.deleteMany({ conversationId });

  // Then delete the conversation itself
  await Conversation.findByIdAndDelete(conversationId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Conversation and its messages deleted successfully",
      ),
    );
});

const clearAllConversations = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  // Get all conversation IDs for this user
  const conversations = await Conversation.find({ userId });
  const conversationIds = conversations.map((c) => c._id);

  // Delete all messages in these conversations
  await Message.deleteMany({ conversationId: { $in: conversationIds } });

  // Delete all conversations
  await Conversation.deleteMany({ userId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "All conversations cleared successfully"));
});

export {
  createConversation,
  getUserConversations,
  getConversationById,
  updateConversationTitle,
  deleteConversation,
  clearAllConversations,
};
