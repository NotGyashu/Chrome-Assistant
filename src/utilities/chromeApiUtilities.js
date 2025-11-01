import {getembdedtext} from "./Embedding.js";
import { generateAi, getAIModel } from "./getAiModal.js";
import { promptResponse } from "./promptsResponse.js";
import { marked } from "marked";
import { htmlToText } from "html-to-text";
import { getGeminiApiKey } from "./apiKeyStorage.js";
import { saveConversationMessage } from "./conversationMemory.js";



export const getTab = async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    // Return the tab object if it exists, otherwise return null
    return tab || null;
  } catch (error) {
    console.error("Error fetching the active tab:", error);
    return null;
  }
};

function markdownToPlainText(markdown) {
  // Convert Markdown to HTML
  const html = marked(markdown);

  // Convert HTML to plain text
  return htmlToText(html);
}

// prompt function - fixed async/await pattern
export async function prompt(message, sendResponse) {
  try {
    const data = await promptResponse(message);
    
    // Convert markdown to plain text for embedding
    const plainText = markdownToPlainText(data.data);
    
    try {
      // Generate embedding for the response
      const responseEmbedding = await getembdedtext(plainText);
      
      // Save conversation with embedding
      await saveConversationMessage(message, data.data, responseEmbedding);
      console.log('Conversation saved with embedding');
    } catch (embeddingError) {
      console.error('Error generating embedding:', embeddingError);
      
      // Save without embedding if embedding fails
      try {
        await saveConversationMessage(message, data.data);
        console.log('Conversation saved without embedding');
      } catch (saveError) {
        console.error('Error saving conversation:', saveError);
      }
    }
    
    // Send response back
    if (sendResponse) {
      sendResponse({ success: true, data: data.data });
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetching prompt:", error);
    
    if (sendResponse) {
      sendResponse({ error: error.message });
    }
    
    throw error;
  }
}


//popupMounted function
export async function popupMounted(
  
  sendResponse,
  
) {
  try {
    

      const apiKey = await getGeminiApiKey();

      if (!apiKey) {
        sendResponse({
          status: 401,
          message: "API key not configured. Please set up your API keys.",
        });
        return;
      }

      try {
        const response = await generateAi(apiKey);
        if (response.success) {
          //console.log("AI initialized successfully");
         
          sendResponse({ status: 200, message: "success" });
        } else {
          sendResponse({
            status: 500,
            message: "Error initializing AI model",
          });
        }
      } catch (error) {
        console.error("Error in connecting to AI model", error);
        sendResponse({
          status: 500,
          message: "Error initializing AI model",
        });
      }

  } catch (error) {
    console.error("Error in initializing:", error);
    sendResponse({ status: 500, message: "Error initializing extension" });
  }
}


// injectScripts function
async function injectScripts(tabId) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: ["content.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          console.log("Scripts injected successfully.");
          resolve();
        }
      }
    );
  });
}
