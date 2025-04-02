import React, { useState, useEffect } from "react";
import Prompt from "./Prompt";
import { handleClose } from "../utilities/reactUtilities";
import { conversationMemory } from "../../public/background";
import { useTheme } from "./ThemeContext";

const Popup = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [ready, setReady] = useState(false);
  const [initialMessage, setInitialMessage] = useState("Loading...");

  useEffect(() => {
    // Message handler for initialization response
    const handleMessage = (message, sender, sendResponse) => {
      if (message.type === "popupReady") {
        setReady(true);
        sendResponse({ status: "done" });
        return true; // Keep the message channel open for response
      }
      return false;
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Initialize the popup
    chrome.runtime.sendMessage(
      { type: "popupMounted" },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Extension error:", chrome.runtime.lastError);
          setInitialMessage("Connection error");
          return;
        }
        if (response?.status === 200) {
          setReady(true);
        } else {
          setInitialMessage(response?.message || "Initialization failed");
        }
      }
    );

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const handleOpenSidePanel = async () => {
    try {
      await chrome.storage.local.set({
        sidePanelData: Array.isArray(conversationMemory) ? conversationMemory : []
      });
      chrome.runtime.sendMessage({ type: "open_side_panel" });
      window.close();
    } catch (error) {
      console.error("Error opening side panel:", error);
    }
  };

  if (!ready) {
    return (
      <div className={`flex justify-center items-center h-full ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          {initialMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full flex flex-col ${
      isDarkMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-white text-gray-900'
    }`}>
      <div className={`flex justify-between items-center p-2 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <button
          onClick={toggleTheme}
          className="p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
          aria-label="Toggle theme"
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleOpenSidePanel}
            className="p-1 rounded hover:bg-opacity-20 hover:bg-gray-500"
            aria-label="Open side panel"
          >
            📂 Panel
          </button>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-opacity-20 hover:bg-gray-500"
            aria-label="Close popup"
          >
            ✕ Close
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-hidden">
        <Prompt />
      </div>
    </div>
  );
};

export default Popup;