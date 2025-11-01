// Background service worker for Chrome Assistant
// Simplified message router - all business logic moved to popup/sidepanel

// Import the prompt response handler
import { promptResponse } from '../src/utilities/promptsResponse.js';

console.log('Background service worker initialized');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension event:', details.reason);
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message.type);
  
  switch (message.type) {
    case 'popupMounted':
      sendResponse({ status: 200, message: 'Popup ready' });
      return true;
    
    case 'prompt':
      // Handle AI prompt requests (async, no response needed)
      promptResponse(message.prompt)
        .then(response => {
          console.log('Prompt response completed');
        })
        .catch(error => {
          console.error('Error processing prompt:', error);
        });
      // Return false since we don't send a response via sendResponse
      return false;
    
    case 'open_side_panel':
    case 'expand_panel':
      chrome.windows.getCurrent({ populate: true }, (window) => {
        chrome.sidePanel.open({
          windowId: window.id,
          tabId: window.tabs[0].id
        }).catch(error => {
          console.error('Error opening side panel:', error);
        });
      });
      return true;
      
    case 'ping':
      sendResponse({ status: 'ok' });
      return true;
      
    default:
      return false;
  }
});

// Configure side panel behavior - disable auto-open on icon click
// User can open side panel from popup instead
if (chrome.sidePanel) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false })
    .catch((error) => console.error('Error setting panel behavior:', error));
}
