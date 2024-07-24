import React, { useState, useEffect, useRef } from "react";
import MarkdownRenderer from "./MarkdownRender";

const Prompt = () => {
  const [prompt, setPrompt] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);

  // Ref for the container and the last message
  const chatContainerRef = useRef(null);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    const handleMessage = (message, sender, sendResponse) => {
      if (message.type === "stream") {
        setCurrentChat((prevChat) => ({
          ...prevChat,
          Gemini: (prevChat?.Gemini || "") + message.data,
        }));
      } else if (message.type === "streamEnd") {
        if (currentChat) {
          setChatLog((prevChatLog) => [...prevChatLog, currentChat]);
          setCurrentChat(null);
        }
        setIsSending(false);
      } else if (message.type === "error") {
        setError(message.message || "An unknown error occurred.");
        setIsSending(false);
      } else {
        console.warn("Unknown message type:", message.type);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [currentChat]);

  useEffect(() => {
    // Scroll to the bottom using scrollIntoView
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatLog, currentChat]);

  const handleSend = () => {
    if (prompt.trim() === "") return;

    setCurrentChat({ you: prompt, Gemini: "" });
    setPrompt("");
    setIsSending(true);
    setError(null);

    chrome.runtime.sendMessage({ type: "prompt", prompt });
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div
        ref={chatContainerRef} // Attach ref to the container
        className="max-h-[300px] overflow-y-scroll p-3 text-lg flex flex-col gap-4"
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

        {/* Scroll to this element to ensure it's always visible */}
        <div ref={endOfMessagesRef} />
      </div>
      {error && (
        <div className="text-red-500 text-center py-2">Error: {error}</div>
      )}
      <div className="flex w-full bg-white rounded-full border justify-center items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask a question"
          className="border px-2 py-1 focus:outline-none rounded-full text-sm w-full text-black flex-grow"
          disabled={isSending}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <div
          onClick={handleSend}
          className={`mx-2 text-green-400 cursor-pointer ${
            isSending ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-disabled={isSending}
        >
          Enter
        </div>
      </div>
    </div>
  );
};

export default Prompt;
