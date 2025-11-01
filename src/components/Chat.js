import React, { useRef, useEffect } from "react";
import MarkdownRenderer from "./MarkdownRender";
import { useTheme } from "./ThemeContext";

const Chat = ({ currentChat, chatLog }) => {
  const { isDarkMode } = useTheme();
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, currentChat]);

  return (
    <div className="flex flex-col gap-6 p-4">
      {chatLog.map((entry, index) => (
        <div key={index} className="flex flex-col gap-4 message-enter">
          {/* User Message */}
          <div className="flex justify-end message-slide" style={{ animationDelay: '0.1s' }}>
            <div className={`rounded-2xl p-4 max-w-[85%] shadow-lg glow-orange ${
              isDarkMode 
                ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white' 
                : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
            }`}>
              <div className="font-medium">{entry.you}</div>
            </div>
          </div>
          
          {/* AI Response */}
          <div className="flex justify-start message-slide" style={{ animationDelay: '0.2s' }}>
            <div className={`rounded-2xl p-4 max-w-[85%] shadow-lg card-halloween ${
              isDarkMode 
                ? 'bg-gradient-to-br from-purple-900/80 to-purple-950/80 text-gray-100 border border-purple-700/30' 
                : 'bg-gradient-to-br from-purple-100 to-purple-200 text-gray-900 border border-purple-300'
            }`}>
              <div className="flex items-center gap-2 mb-2 text-sm opacity-75">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                <span className="font-semibold">AI Assistant</span>
              </div>
              <MarkdownRenderer content={entry.Gemini} />
            </div>
          </div>
        </div>
      ))}

      {currentChat && (
        <div className="flex flex-col gap-4 message-enter">
          {/* User Message */}
          <div className="flex justify-end message-slide">
            <div className={`rounded-2xl p-4 max-w-[85%] shadow-lg glow-orange ${
              isDarkMode 
                ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white' 
                : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
            }`}>
              <div className="font-medium">{currentChat.you}</div>
            </div>
          </div>
          
          {/* AI Response with Thinking Indicator */}
          <div className="flex justify-start message-slide" style={{ animationDelay: '0.1s' }}>
            <div className={`rounded-2xl p-4 max-w-[85%] shadow-lg card-halloween ${
              isDarkMode 
                ? 'bg-gradient-to-br from-purple-900/80 to-purple-950/80 text-gray-100 border border-purple-700/30' 
                : 'bg-gradient-to-br from-purple-100 to-purple-200 text-gray-900 border border-purple-300'
            }`}>
              <div className="flex items-center gap-2 mb-2 text-sm opacity-75">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                <span className="font-semibold">AI Assistant</span>
              </div>
              {currentChat.Gemini ? (
                <MarkdownRenderer content={currentChat.Gemini} />
              ) : (
                <div className="flex items-center gap-3 py-2">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-orange-500 rounded-full thinking-dot"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full thinking-dot"></span>
                    <span className="w-2 h-2 bg-orange-500 rounded-full thinking-dot"></span>
                  </div>
                  <span className="text-sm opacity-70 animate-pulse">Thinking...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default Chat;