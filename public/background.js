import {
  popupMounted,
  prompt,
  summarizePage,
} from "../src/utilities/chromeApiUtilities";
import {
  enhancedPrompt,

} from "../src/utilities/Embedding";

let extractedData = null;

export let conversationMemory = {};


chrome.runtime.onInstalled.addListener(async () => {
  console.log("Extension installed or updated.");
  
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "popupMounted") {
    popupMounted( sendResponse);
    return true;
  } else if (message.type === "prompt") {
    enhancedPrompt(message.prompt)
      .then((response) => {
       // console.log("enhanced prompt response recieved in background", response);
  prompt(response.prompt, sendResponse);
       
      })
      .catch((error) => {
        console.error("Error in enhancing prompt:", error);
        sendResponse({ error: error.message });
      });


  }
});
