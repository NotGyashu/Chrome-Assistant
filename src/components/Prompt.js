import React, { useState, useEffect } from "react";
import { conversationMemory } from "../../public/background";
import Chat from "./Chat";
import Welcome from "./welcome";
import { useTheme } from "./ThemeContext";

const Prompt = () => {
  const { isDarkMode } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    chrome.storage.local.get("sidePanelData", (result) => {
      const fetchedData = result.sidePanelData;
      setChatLog(Array.isArray(fetchedData) ? fetchedData : []);
    });
  }, []);

  useEffect(() => {
    const handleMessage = (message) => {
      switch (message.type) {
        case "stream":
          setCurrentChat(prev => ({ ...prev, Gemini: (prev?.Gemini || "") + message.data }));
          break;
        case "streamEnd":
          if (currentChat) {
            setIsSending(false);
            setChatLog(prev => [...prev, currentChat]);
            conversationMemory.push(currentChat);
            setCurrentChat(null);
          }
          break;
        case "error":
          setError(message.message || "An error occurred");
          setIsSending(false);
          break;
        default:
          console.warn("Unknown message type:", message.type);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, [currentChat]);

  const handleSend = () => {
    if (!prompt.trim()) return;
    
    setCurrentChat({ you: prompt, Gemini: "" });
    setPrompt("");
    setIsSending(true);
    setError(null);
    chrome.runtime.sendMessage({ type: "prompt", prompt });
  };

  return (
    <div className="flex flex-col h-full px-2 pb-2">
      <div className="flex-grow overflow-auto custom-scrollbar">
        {chatLog.length > 0 || currentChat ? (
          <Chat currentChat={currentChat} chatLog={chatLog} />
        ) : (
          <Welcome />
        )}
        {error && (
          <div className={`text-center py-2 ${isDarkMode ? 'text-theme-dark-error' : 'text-theme-light-error'}`}>
            Error: {error}
            <button 
              onClick={handleSend}
              className="ml-2 underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>
      
      <div className={`mt-2 flex items-center border rounded-full px-3 py-1 ${
        isDarkMode 
          ? 'border-theme-dark-primary bg-theme-dark-background' 
          : 'border-theme-light-primary bg-white'
      }`}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow bg-transparent outline-none px-2 py-1"
          disabled={isSending}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={isSending}
          className={`p-1 rounded-full ${
            isSending 
              ? 'text-gray-400' 
              : isDarkMode 
                ? 'text-theme-dark-accent hover:bg-theme-dark-primary' 
                : 'text-theme-light-accent hover:bg-theme-light-primary hover:text-white'
          }`}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default Prompt;