import { generateEmbedding, loadEmbeddingModel } from "./Embedding.js";
import { generateAi, getAIModel } from "./getAiModal.js";
import { promptResponse } from "./promptsResponse.js";
// prompt  function
export function prompt(message, sendResponse, conversationMemory) {
  console.log("prompt received in background", message.prompt);
 promptResponse(message.prompt)
    .then((response) => {
      console.log("prompt response recieved in background", response);

      if (!response.ok) {
        throw new Error("prompt response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("prompt dta recieved in background", data);
      generateEmbedding(data.data, embeddingModel) // Assuming 'data.response_text' holds the AI's response
        .then((responseEmbedding) => {
          // 2. Update conversationMemory:
          const messageId = Date.now(); // Or generate a unique ID
          conversationMemory[messageId] = {
            text: data.data,
            embedding: responseEmbedding,
          };
        });
      sendResponse(data);
    })
    .catch((error) => {
      console.error("Error in fetching prompt:", error);
      sendResponse({ error: error.message });
    });
}

//summarizePage function
export function summarizePage() {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (tabs[0]) {
      const currentTabUrl = tabs[0].url;
      fetch("http://localhost:3000/server/background/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: currentTabUrl }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          sendResponse(data);
        })
        .catch((error) => {
          console.error("Error in fetching summary:", error);
          sendResponse({ error: error.message });
        });
    }
  });
}

//popupMounted function
export async function popupMounted(
  extractedData,
  sendResponse,
  embeddingModel
) {
  try {
    const tabs = await new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(tabs);
        }
      });
    });

    if (tabs[0]) {
      await injectScripts(tabs[0].id); 
      const currentTabUrl = tabs[0].url;
      console.log(currentTabUrl);

      const apiKey = await fetchApiKey();
      console.log(apiKey);

      try {
        const response = await generateAi(apiKey);
        if (response.success) {
          console.log("AI initialized successfully");

          const model = loadEmbeddingModel();
          embeddingModel = model;
          console.log("Embedding model loaded and ready!");
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
    } else {
      sendResponse({ status: 500, message: "No active tab found" });
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
