import {getembdedtext} from "./Embedding.js";
import { generateAi, getAIModel } from "./getAiModal.js";
import { promptResponse } from "./promptsResponse.js";
import {conversationMemory, ready} from "../../public/background.js";
import { marked } from "marked";
import { htmlToText } from "html-to-text";
function markdownToPlainText(markdown) {
  // Convert Markdown to HTML
  const html = marked(markdown);

  // Convert HTML to plain text
  return htmlToText(html);
}

// prompt  function
export function prompt(message, sendResponse) {
  //console.log("prompt received in background", message); 
 promptResponse(message).then((data) => {
     // console.log("prompt res ", data);
     const plainText = markdownToPlainText(data.data);
      getembdedtext(plainText) // Assuming 'data.response_text' holds the AI's response
        .then((responseEmbedding) => {
          // 2. Update conversationMemory:
          const messageId = Date.now(); // Or generate a unique ID
          conversationMemory[messageId] = {
            text: data.data,
            embedding: responseEmbedding,
          };
        });
    
    })
    .catch((error) => {
      console.error("Error in fetching prompt:", error);
      sendResponse({ error: error.message });
    });
}


//popupMounted function
export async function popupMounted(
  
  sendResponse,
  
) {
  try {
    

      const apiKey = await fetchApiKey();
      console.log(apiKey);

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
    console.error("Error in injecting scripts:", error);
    sendResponse({ status: 500, message: "Error injecting scripts" });
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

// Function to fetch the API key from the extension
async function fetchApiKey() {
  try {
    const response = await fetch(chrome.runtime.getURL("/key.js"));
    const text = await response.text();
    const match = text.match(/const\s+codeKey\s*=\s*['"]([^'"]+)['"]/i);

    return match ? match[1] : null;
  } catch (error) {
    console.error("Error in fetching API key:", error);
    throw error;
  }
}
