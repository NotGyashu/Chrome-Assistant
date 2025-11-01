import { getAIModel } from "./getAiModal.js";
import { getConversationContext } from "./conversationMemory.js";

// Constants
const STREAM_END_DELAY_MS = 500; // Delay before signaling stream end to ensure all chunks are processed

async function promptResponse(prompt) {
  try {
    const model = await getAIModel(); // await the model retrieval
    if (!model) {
      throw new Error("AI model not initialized");
    }
    
    // Get conversation history in Gemini-compatible format
    const conversationHistory = await getConversationContext();
    
    const chat = model.startChat({ history: conversationHistory });
    const msg = prompt;

    const result = await chat.sendMessageStream(msg);

    let fullResponse = '';

    // Send each chunk as it arrives
    for await (const chunk of result.stream) {
      const chunkText = await chunk.text();
      fullResponse += chunkText;
      
      console.log("Chunk:", chunkText);

      // Send each chunk to the content script
      chrome.runtime.sendMessage({ type: "stream", data: chunkText });
    }

    // Ensure the final chunk is sent before signaling end
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: "streamEnd" });
    }, STREAM_END_DELAY_MS);
    
    // Return the full response for saving
    return { success: true, data: fullResponse };
   
  } catch (err) {
    console.error("Error in getting response of prompt:", err);
    
    // Provide better error messages based on error type
    let errorMessage = "An error occurred while getting AI response";
    
    if (!navigator.onLine) {
      errorMessage = "No internet connection. Please check your network and try again.";
    } else if (err.status === 429) {
      errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
    } else if (err.status === 401 || err.status === 403) {
      errorMessage = "Invalid API key. Please check your API keys in settings.";
    } else if (err.message) {
      errorMessage = `Failed to get AI response: ${err.message}`;
    }
    
    chrome.runtime.sendMessage({ 
      type: "error", 
      message: errorMessage,
      retryable: !navigator.onLine || err.status === 429
    });
    throw err;
  }
}

export { promptResponse };
