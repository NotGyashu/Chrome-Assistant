import { popupMounted, prompt } from "../src/utilities/chromeApiUtilities";
import { promptResponse } from "../src/utilities/promptsResponse";

export let conversationMemory = [];



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "popupMounted") {
    popupMounted(sendResponse);
    return true;
  } else if (message.type === "prompt") {
    promptResponse(message.prompt);
  } else if (message.type === "open_side_panel") {
    chrome.windows.getCurrent({ populate: true }, (window) => {
      chrome.sidePanel.open(
        {
          windowId: window.id,
          tabId: window.tabs[0].id,
        },
        () => {
          console.log("Side panel opened.");
        }
      );
    });
  }
});
