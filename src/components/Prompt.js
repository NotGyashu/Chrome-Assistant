import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import Welcome from "./welcome";
import { useTheme } from "./ThemeContext";
import { getConversationHistory, saveConversationMessage } from "../utilities/conversationMemory";
import { enhancedPrompt } from "../utilities/Embedding";
import { promptResponse } from "../utilities/promptsResponse";

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

  const handleSend = async () => {
    if (!prompt.trim()) return;
    
    const originalPrompt = prompt;
    setPrompt("");
    setIsSending(true);
    setError(null);
    
    // Set currentChat immediately to show thinking indicator
    setCurrentChat({ you: originalPrompt, Gemini: "" });
    
    try {
      // Call prompt response directly (no background worker needed for streaming)
      await promptResponse(originalPrompt, {
        onStream: (chunk) => {
          // Update UI with each chunk
          setCurrentChat(prev => ({
            ...prev,
            Gemini: (prev?.Gemini || "") + chunk
          }));
        },
        onComplete: (fullResponse) => {
          // Finalize the message
          const finalChat = {
            you: originalPrompt,
            Gemini: fullResponse
          };
          setIsSending(false);
          setChatLog(prev => [...prev, finalChat]);
          
          // Save to storage
          saveConversationMessage(originalPrompt, fullResponse)
            .catch(err => console.error('Error saving conversation:', err));
          
          setCurrentChat(null);
        },
        onError: (errorMessage) => {
          setError(errorMessage);
          setIsSending(false);
          setCurrentChat(null);
        }
      });
    } catch (error) {
      console.error('Error in handleSend:', error);
      setError(error.message || "An error occurred");
      setIsSending(false);
      setCurrentChat(null);
    }
  };

  return (
    <div className="flex flex-col h-full px-3 pb-3">
      <div className="flex-grow overflow-auto custom-scrollbar">
        {chatLog.length > 0 || currentChat ? (
          <Chat currentChat={currentChat} chatLog={chatLog} />
        ) : (
          <Welcome />
        )}
        {error && (
          <div className="mx-4 mb-4 message-enter">
            <div className={`rounded-xl p-4 border-2 ${
              isDarkMode 
                ? 'bg-red-900/20 border-red-700 text-red-300' 
                : 'bg-red-50 border-red-400 text-red-700'
            }`}>
              <div className="flex items-center gap-2 font-semibold mb-1">
                <span>⚠️</span>
                <span>Error</span>
              </div>
              <p className="text-sm">{error}</p>
              <button 
                onClick={handleSend}
                className="mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105"
              >
                🔄 Retry
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className={`mt-3 flex items-center gap-2 border-2 rounded-2xl px-4 py-2 transition-all duration-300 ${
        isDarkMode 
          ? 'border-purple-700/50 bg-gradient-to-r from-gray-900/80 to-purple-900/40 backdrop-blur-sm' 
          : 'border-purple-300 bg-gradient-to-r from-white to-purple-50'
      } ${isSending ? 'opacity-60' : 'input-halloween'}`}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="✨ Type your message..."
          className={`flex-grow bg-transparent outline-none px-2 py-1.5 ${
            isDarkMode ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
          }`}
          disabled={isSending}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={isSending || !prompt.trim()}
          className={`p-2.5 rounded-xl font-bold transition-all duration-300 ${
            isSending || !prompt.trim()
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'btn-halloween text-white shadow-lg hover:shadow-orange-500/50'
          }`}
          title="Send message"
        >
          {isSending ? (
            <div className="animate-spin">⏳</div>
          ) : (
            <span className="text-lg">🎃</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Prompt;