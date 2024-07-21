import React, { useState } from "react";

const Prompt = () => {
  const [prompt, setPrompt] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = () => {
    if (prompt.trim() === "") return;

    setChatLog([...chatLog, { you: prompt, Gemini: "" }]);
    setPrompt("");
    setIsSending(true);
    setError(null);

    chrome.runtime.sendMessage({ type: "prompt", prompt }, (response) => {
      console.log(response)
      setIsSending(false);
      if (response && response.data) {
        setChatLog((prevChatLog) => {
          const updatedChatLog = [...prevChatLog];
          updatedChatLog[updatedChatLog.length - 1].Gemini = response.data;
          return updatedChatLog;
        });
      } else {
        const errorMessage = response ? response.message : "Unknown error";
        console.error("Error sending prompt:", errorMessage);
        setError(errorMessage);
      }
    });
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div
        className="max-h-[300px] overflow-y-scroll p-3 flex flex-col gap-4"
        aria-live="polite"
      >
        {chatLog.map((entry, index) => (
          <div key={index} className="flex flex-col">
            <p className="font-semibold">You: {entry.you}</p>
            {entry.Gemini && (
              <p className="font-semibold">Gemini: {entry.Gemini}</p>
            )}
          </div>
        ))}
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
