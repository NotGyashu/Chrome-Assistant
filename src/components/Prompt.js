import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import Welcome from "./welcome";
import { useTheme } from "./ThemeContext";
import { getConversationHistory, saveConversationMessage } from "../utilities/conversationMemory";
import { enhancedPrompt } from "../utilities/Embedding";

const Prompt = () => {
  const { isDarkMode } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    loadConversationHistory();
  }, []);

  const loadConversationHistory = async () => {
    try {
      const history = await getConversationHistory();
      // Convert to old format for compatibility
      const formattedHistory = history.map(msg => ({
        you: msg.userMessage,
        Gemini: msg.aiResponse
      }));
      setChatLog(formattedHistory);
    } catch (error) {
      console.error('Error loading conversation history:', error);
      setChatLog([]);
    }
  };

  useEffect(() => {
    const handleMessage = (message) => {
      switch (message.type) {
        case "stream":
          setCurrentChat(prev => ({ ...prev, Gemini: (prev?.Gemini || "") + message.data }));
          break;
        case "streamEnd":
          if (currentChat) {
            const finalChat = {
              ...currentChat,
              Gemini: currentChat.Gemini
            };
            setIsSending(false);
            setChatLog(prev => [...prev, finalChat]);
            
            // Save to storage
            saveConversationMessage(currentChat.you, currentChat.Gemini)
              .catch(err => console.error('Error saving conversation:', err));
            
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

  const handleSend = async () => {
    if (!prompt.trim()) return;
    
    const originalPrompt = prompt;
    setPrompt("");
    setIsSending(true);
    setError(null);
    
    try {
      // Use enhanced prompt with semantic search
      const enhanced = await enhancedPrompt(originalPrompt);
      
      if (enhanced.error) {
        console.warn('Failed to enhance prompt, using original:', enhanced.error);
        // Fall back to original prompt if enhancement fails
        setCurrentChat({ you: originalPrompt, Gemini: "" });
        chrome.runtime.sendMessage({ type: "prompt", prompt: originalPrompt });
      } else {
        // Use enhanced prompt with context
        setCurrentChat({ you: originalPrompt, Gemini: "" });
        chrome.runtime.sendMessage({ type: "prompt", prompt: enhanced.prompt });
      }
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      // Fall back to original prompt on error
      setCurrentChat({ you: originalPrompt, Gemini: "" });
      chrome.runtime.sendMessage({ type: "prompt", prompt: originalPrompt });
    }
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