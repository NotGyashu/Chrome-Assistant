import React, { useState, useEffect } from "react";
import Prompt from "./Prompt";
import SetupScreen from "./SetupScreen";
import Settings from "./Settings";
import { handleClose } from "../utilities/reactUtilities";
import { useTheme } from "./ThemeContext";
import { areKeysConfigured, getGeminiApiKey } from "../utilities/apiKeyStorage";
import { generateAi } from "../utilities/getAiModal";

const SidePanel = () => {
  const { isDarkMode = true, toggleTheme = () => {} } = useTheme() || {};
  const [ready, setReady] = useState(false);
  const [keysConfigured, setKeysConfigured] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [initialMessage, setInitialMessage] = useState("Loading...");

  useEffect(() => {
    checkApiKeys();
  }, []);

  const checkApiKeys = async () => {
    try {
      const configured = await areKeysConfigured();
      setKeysConfigured(configured);
      
      if (configured) {
        // Keys exist, initialize AI
        await initializeAI();
      } else {
        // No keys, show setup screen
        setInitialMessage("Setup required");
      }
    } catch (error) {
      console.error("Error checking API keys:", error);
      setInitialMessage("Error checking configuration");
    }
  };

  const initializeAI = async () => {
    try {
      const apiKey = await getGeminiApiKey();
      if (!apiKey) {
        setKeysConfigured(false);
        return;
      }

      const response = await generateAi(apiKey);
      if (response.success) {
        setReady(true);
      } else {
        setInitialMessage("Error initializing AI model");
        console.error("AI initialization failed:", response.message);
      }
    } catch (error) {
      console.error("Error initializing AI:", error);
      setInitialMessage("Error initializing AI model");
    }
  };

  const handleSetupComplete = async () => {
    // After setup, check keys and initialize
    await checkApiKeys();
  };

  const handleExpandPanel = async () => {
    try {
      chrome.runtime.sendMessage(
        { type: "expand_panel" },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Failed to expand panel:", chrome.runtime.lastError);
          }
        }
      );
    } catch (error) {
      console.error("Error expanding panel:", error);
    }
  };

  // Show setup screen if keys not configured
  if (!keysConfigured) {
    return <SetupScreen onSetupComplete={handleSetupComplete} />;
  }

  // Show settings if requested
  if (showSettings) {
    return <Settings onBack={() => setShowSettings(false)} />;
  }

  // Show loading state
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

  // Show main app
  return (
    <div className={`flex flex-col h-full w-full gradient-bg ${
      isDarkMode 
        ? 'text-gray-100' 
        : 'bg-gradient-to-br from-purple-50 to-orange-50 text-gray-900'
    }`}>
      <div className={`flex justify-between items-center p-3 backdrop-blur-md border-b transition-all ${
        isDarkMode ? 'border-purple-700/30 bg-black/20' : 'border-purple-200 bg-white/40'
      }`}>
        <button
          onClick={toggleTheme}
          className={`px-3 py-2 rounded-xl font-medium transition-all duration-300 glow-purple ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-700 to-purple-800 text-white hover:from-purple-600 hover:to-purple-700' 
              : 'bg-gradient-to-r from-purple-200 to-purple-300 text-purple-900 hover:from-purple-300 hover:to-purple-400'
          }`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-xl transition-all duration-300 ${
              isDarkMode 
                ? 'hover:bg-purple-900/50 text-purple-300' 
                : 'hover:bg-purple-200 text-purple-700'
            }`}
            aria-label="Open settings"
            title="Settings"
          >
            <span className="text-xl">⚙️</span>
          </button>
          <button
            onClick={handleExpandPanel}
            className={`p-2 rounded-xl transition-all duration-300 ${
              isDarkMode 
                ? 'hover:bg-purple-900/50 text-purple-300' 
                : 'hover:bg-purple-200 text-purple-700'
            }`}
            aria-label="Expand panel"
          >
            <span className="text-xl">⛶</span>
          </button>
          <button
            onClick={handleClose}
            className={`p-2 rounded-xl transition-all duration-300 ${
              isDarkMode 
                ? 'hover:bg-red-900/50 text-red-400' 
                : 'hover:bg-red-200 text-red-700'
            }`}
            aria-label="Close panel"
          >
            <span className="text-xl">✕</span>
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