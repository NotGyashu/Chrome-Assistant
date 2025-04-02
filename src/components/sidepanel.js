import React, { useState, useEffect } from "react";
import Prompt from "./Prompt";
import { handleClose } from "../utilities/reactUtilities";
import { conversationMemory } from "../../public/background";
import { useTheme } from "./ThemeContext";

const SidePanel = () => {
  const { isDarkMode = true, toggleTheme = () => {} } = useTheme() || {};
  const [ready, setReady] = useState(false);
  const [initialMessage, setInitialMessage] = useState("Loading...");

  useEffect(() => {
    const handleMessageResponse = (response) => {
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
    };

    // Message handler for incoming messages
    const messageListener = (message, sender, sendResponse) => {
      if (message.type === "sidePanelReady") {
        setReady(true);
        sendResponse({ status: "done" });
        return true;
      }
      return false;
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Initialize the side panel
    chrome.runtime.sendMessage(
      { type: "sidePanelMounted" },
      handleMessageResponse
    );

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handleExpandPanel = async () => {
    try {
      await chrome.storage.local.set({
        sidePanelData: Array.isArray(conversationMemory) ? conversationMemory : []
      });
      
      chrome.runtime.sendMessage(
        { type: "expand_panel" },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Failed to expand panel:", chrome.runtime.lastError);
          }
        }
      );
    } catch (error) {
      console.error("Storage error:", error);
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
    <div className={`flex flex-col h-full w-full ${
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
            onClick={handleExpandPanel}
            className="p-1 rounded hover:bg-opacity-20 hover:bg-gray-500"
            aria-label="Expand panel"
          >
            ⛶ Expand
          </button>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-opacity-20 hover:bg-gray-500"
            aria-label="Close panel"
          >
            ✕ Close
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-auto p-2 custom-scrollbar">
        <Prompt />
      </div>
    </div>
  );
};

export default SidePanel;