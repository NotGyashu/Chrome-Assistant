import { fetchApiKey } from "./chromeApiUtilities";

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

let aiModel = null; // Store the model (can be undefined initially)

async function generateAi(apiKey) {
  try {
    if (!apiKey) {
      throw new Error("API key is required");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    aiModel = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig,
      safetySettings,
    });
    // console.log("AI model initialized successfully", model);
    return { success: true, message: "AI model initialized successfully" };
  } catch (error) {
    console.error("Error in AI generation:", error);
    return {
      success: false,
      message: "An error occurred during AI generation.",
      error: error.message,
    };
  }
}

function getAIModel() {
  if (!aiModel) {
    const apikey = fetchApiKey();
    generateAi(apikey);
    return aiModel;
    
  }
  return aiModel;
}

export { generateAi, getAIModel };
