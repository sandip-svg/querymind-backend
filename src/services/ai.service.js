import genAI from "../config/gemini.config.js"; // Change import to gemini.config.js
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js"; // Import ApiError to handle specific errors

const generateAIResponse = async (conversationId, userId) => {
  // 1. Fetch conversation history
  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .select("content role");

  // 2. Format for Gemini (last 10 messages to avoid token overflow)
  // Gemini's chat history typically alternates user and model roles.
  // The first message after the system instruction should ideally be 'user'.
  const recentMessages = messages.slice(-10).map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user", // Gemini uses 'user' and 'model'
    parts: [{ text: msg.content }],
  }));

  console.log("Messages sent to Gemini:", recentMessages); // For debugging

  // 3. Call Gemini
  try {
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });

    // Initialize chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are a helpful assistant. Keep responses concise.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Okay, I understand. I will keep my responses concise.",
            },
          ],
        },
        ...recentMessages.map((msg) => ({
          role: msg.role,
          parts: msg.parts,
        })),
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200, // Good practice to set a limit
      },
    });

    // Send the last message in the conversation (which should be the user's latest input)
    // Find the actual last user message to send, assuming recentMessages ends with the user's last message
    const lastUserMessage = recentMessages[recentMessages.length - 1];

    if (!lastUserMessage || lastUserMessage.role !== "user") {
      console.error("No valid last user message to send to Gemini.");
      throw new ApiError(500, "No valid user message to send to AI.");
    }

    const result = await chat.sendMessage(lastUserMessage.parts[0].text);
    const response = await result.response;
    const aiContent = response.text(); // Gemini uses .text() to get the content

    console.log("Gemini API Response (raw):", response); // For debugging
    console.log("Gemini AI Generated Content:", aiContent); // For debugging

    if (!aiContent || aiContent.trim() === "") {
      console.error("Gemini response did not contain expected content.");
      throw new ApiError(500, "Failed to get a valid response from AI.");
    }

    // 4. Save AI response to database
    const aiMessage = await Message.create({
      userId,
      conversationId,
      content: aiContent,
      role: "assistant",
      status: "delivered",
      metadata: { type: "text" },
    });

    console.log("AI Message saved to DB:", aiMessage); // For debugging

    return aiMessage;
  } catch (error) {
    console.error(
      "[AI Service Error]",
      `Conversation ${conversationId}:`,
      error
    );
    if (error.message.includes("429") || error.message.includes("quota")) {
      throw new ApiError(
        429,
        "Gemini API quota exceeded or billing issue. Please check your plan and billing details."
      );
    }
    // Catch other potential errors from the Gemini API or network issues
    throw new ApiError(
      500,
      `Failed to generate AI response: ${error.message || "Unknown AI error"}`
    );
  }
};

export { generateAIResponse };
