// config/gemini.config.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log(
  "Gemini API Key being used:",
  process.env.GEMINI_API_KEY ? "Loaded" : "Not Loaded or Empty"
);

export default genAI;
