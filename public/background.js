import {
  popupMounted,
  prompt,
  summarizePage,
} from "../src/utilities/chromeApiUtilities";
import { enhancedPrompt,loadEmbeddingModel } from "../src/utilities/Embedding";

let extractedData = null;
let embeddingModel = null;
let conversationMemory = {};




chrome.runtime.onInstalled.addListener(() => {
  console.log("Background script installed or updated.");
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "popupMounted") {
    popupMounted(extractedData, sendResponse, embeddingModel);
    return true;
  } else if (message.type === "summarizePage") {
    summarizePage();
    return true;
  } else if (message.type === "prompt") {
    enhancedPrompt(message.prompt, embeddingModel, conversationMemory)
      .then((response) => {
        console.log("enhanced prompt response recieved in background", response);
        prompt(response.prompt, sendResponse, conversationMemory);
        return true;
      })
      .catch((error) => {
        console.error("Error in enhancing prompt:", error);
        sendResponse({ error: error.message });
      });

    
    return true;
  }
});
