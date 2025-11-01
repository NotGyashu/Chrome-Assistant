import { getAIModel } from "./getAiModal.js";
import { getConversationContext } from "./conversationMemory.js";

async function promptResponse(prompt, callbacks = {}) {
  const { onStream, onComplete, onError } = callbacks;
  
  try {
    const model = await getAIModel();
    if (!model) {
      throw new Error("AI model not initialized");
    }
    
    // Get conversation history in Gemini-compatible format
    const conversationHistory = await getConversationContext();
    
    const chat = model.startChat({ history: conversationHistory });
    const result = await chat.sendMessageStream(prompt);

    let fullResponse = '';

    // Stream each chunk
    for await (const chunk of result.stream) {
      const chunkText = await chunk.text();
      fullResponse += chunkText;
      
      // Call onStream callback if provided
      if (onStream) {
        onStream(chunkText);
      }
    }

    // Call onComplete callback if provided
    if (onComplete) {
      onComplete(fullResponse);
    }
    
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
    
    // Call onError callback if provided
    if (onError) {
      onError(errorMessage);
    }
    
    throw err;
  }
}

export { promptResponse };
