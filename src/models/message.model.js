import mongoose, { Schema } from "mongoose";

const messageSchema = Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    status: {
      type: String,
      enum: ["sending", "delivered", "read", "failed"],
      default: "delivered",
    },
    metadata: {
      type: {
        type: String,
        enum: ["text", "image", "link", "code"],
        default: "text",
      },
      language: String, // For code snippets
      url: String, // For images/links
    },
    editHistory: [
      {
        content: String,
        editedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: true, // Allows virtual populate
  }
);

export const Message = mongoose.model("Message", messageSchema);
