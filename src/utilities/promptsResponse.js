import { conversationMemory } from "../../public/background.js";
import { getAIModel } from "./getAiModal.js";

async function promptResponse(prompt) {
  try {
    const model = getAIModel();
    if (!model) {
      throw new Error("AI model not initialized");
    }
  const chat = model.startChat({history:conversationMemory})
  const msg = prompt;

   const result = await chat.sendMessageStream(msg);


    // Send each chunk as it arrives
    for await (const chunk of result.stream) {
      const chunkText = await chunk.text();
     
      console.log("Chunk:", chunkText);

      // Send each chunk to the content script
      chrome.runtime.sendMessage({ type: "stream", data: chunkText });
    }

    // Ensure the final chunk is sent before signaling end
  setTimeout(() => {
    chrome.runtime.sendMessage({ type: "streamEnd" });
  }, 500);
   
  } catch (err) {
    console.log("Error in getting response of prompt:", err);
    chrome.runtime.sendMessage({ type: "error", message: "gemini is dead" });
    
  }
}

export { promptResponse };
