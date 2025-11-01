// background.js
let conversationMemory = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "popupMounted":
      sendResponse({ status: 200, message: "Popup ready" });
      return true; // Important for async response
    
    case "prompt":
    case "gemini is dead":
      promptResponse(message.prompt)
        .then(response => {
          chrome.runtime.sendMessage({
            type: "stream",
            data: response
          });
        })
        .catch(error => {
          chrome.runtime.sendMessage({
            type: "error",
            message: error.message
          });
        });
      break;
      
    case "open_side_panel":
    case "expand_panel":
      chrome.windows.getCurrent({ populate: true }, (window) => {
        chrome.sidePanel.open({
          windowId: window.id,
          tabId: window.tabs[0].id
        });
      });
      break;
  }
  
  // Return false if not handling the message
  return false;
});