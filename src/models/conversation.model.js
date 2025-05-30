import mongoose, { Schema } from "mongoose";

const conversationSchema = Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    title: {
      type: String,
      default: "New Chat",
    },
  },
  { timestamps: true },
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
