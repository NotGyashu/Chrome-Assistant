import React from 'react'
import MarkdownRenderer from "./MarkdownRender";
import { useRef, useEffect } from "react";


const Chat = ({currentChat,chatLog}) => {
    
  const chatContainerRef = useRef(null);
  const endOfMessagesRef = useRef(null);


  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatLog, currentChat]);




  return (
    <div
      ref={chatContainerRef}
      className=" p-3 text-lg flex  flex-col gap-4 overflow-auto custom-scrollbar"
      aria-live="polite"
     >
      {chatLog.map((entry, index) => (
        <div key={index} className="flex flex-col">
          <p>You: {entry.you}</p>
          <div>
            Gemini: <MarkdownRenderer content={entry.Gemini} />
          </div>
        </div>
      ))}

      {currentChat && (
        <div>
          <p>You: {currentChat.you}</p>
          <div>
            Gemini: <MarkdownRenderer content={currentChat.Gemini} />
          </div>
        </div>
      )}

      <div ref={endOfMessagesRef} />
    </div>
  );
}

export default Chat