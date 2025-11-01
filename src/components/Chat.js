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
    <div className="flex flex-col gap-4 p-2">
      {chatLog.map((entry, index) => (
        <div key={index} className="flex flex-col gap-3">
          <div className={`self-end rounded-lg p-3 max-w-[85%] ${
            isDarkMode 
              ? 'bg-theme-dark-primary text-white' 
              : 'bg-theme-light-primary text-white'
          }`}>
            {entry.you}
          </div>
          <div className={`self-start rounded-lg p-3 max-w-[85%] ${
            isDarkMode 
              ? 'bg-theme-dark-secondary text-theme-dark-text border border-gray-700' 
              : 'bg-theme-light-secondary text-theme-light-text border border-blue-100'
          }`}>
            <MarkdownRenderer content={entry.Gemini} />
          </div>
        </div>
      ))}

      {currentChat && (
        <div className="flex flex-col gap-3">
          <div className={`self-end rounded-lg p-3 max-w-[85%] ${
            isDarkMode 
              ? 'bg-theme-dark-primary text-white' 
              : 'bg-theme-light-primary text-white'
          }`}>
            {currentChat.you}
          </div>
          <div className={`self-start rounded-lg p-3 max-w-[85%] ${
            isDarkMode 
              ? 'bg-theme-dark-secondary text-theme-dark-text border border-gray-700' 
              : 'bg-theme-light-secondary text-theme-light-text border border-blue-100'
          }`}>
            <MarkdownRenderer content={currentChat.Gemini} />
          </div>
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default Chat;