import React, { useState, useEffect } from "react";
import { conversationMemory } from "../../public/background";
import Chat from "./Chat";
import Welcome from "./welcome";

const Prompt = () => {
  const [prompt, setPrompt] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    chrome.storage.local.get("sidePanelData", (result) => {
      const fetchedData = result.sidePanelData;
      if (Array.isArray(fetchedData)) {
        setChatLog(fetchedData);
      } else {
        console.error("Fetched data is not an array:", fetchedData);
        setChatLog([]);
      }
    });
  }, []);

  useEffect(() => {
    const handleMessage = (message) => {
      switch (message.type) {
        case "stream":
          setCurrentChat((prevChat) => ({
            ...prevChat,
            Gemini: (prevChat?.Gemini || "") + message.data,
          }));
          break;
        case "streamEnd":
          if (currentChat) {
            setIsSending(false);
            setChatLog((prevChatLog) => [...prevChatLog, currentChat]);
            conversationMemory.push(currentChat);
            setCurrentChat(null);
          }
          break;
        case "error":
          setError(message.message || "An unknown error occurred.");
          setIsSending(false);
          break;
        default:
          console.warn("Unknown message type:", message.type);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [currentChat]);

  const handleSend = () => {
    if (prompt.trim() === "") return;

    setCurrentChat({ you: prompt, Gemini: "" });
    setPrompt("");
    setIsSending(true);
    setError(null);

    chrome.runtime.sendMessage({ type: "prompt", prompt });
  };

  return (
    <div className="w-full h-full  flex flex-col px-1">
      <div className=" w-full flex-grow  overflow-auto">
        {chatLog.length > 0 || currentChat ? (
          <Chat currentChat={currentChat} chatLog={chatLog} />
        ) : (
          <Welcome />
        )}

        {error && (
          <div className="text-red-500 text-center py-2">Error: {error} <br/>
          Retry</div>
        )}
      </div>
      <div className="flex  border mb-1  w-full bg-white rounded-full  justify-center  items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your message here..."
          className="px-2 py-1 focus:outline-none rounded-full text-sm w-full text-black flex-grow"
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
          Send
        </div>
      </div>
    </div>
  );
};

export default Prompt;
