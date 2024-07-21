const { GoogleGenerativeAI } = require("@google/generative-ai");
let aiModel = null; // Store the model (can be undefined initially)

async function generateAi(apiKey) {
  try {
   
    
    if (!apiKey) {
      throw new Error("API key is required");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    aiModel = model;
    console.log("AI model initialized successfully", model);
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
    throw new Error("AI model not initialized!");
  }
  return aiModel;
}

export { generateAi, getAIModel };
