import { getAIModel } from "./getAiModal.js";

async function promptResponse(prompt) {
  try {
    const model = getAIModel();
    if (!model) {
      throw new Error("AI model not initialized");
    }

    // Call generateContentStream and handle its result
    const result = await model.generateContentStream(prompt);

    // Ensure result.stream is an async iterable
    if (
      !result ||
      typeof result.stream !== "object" ||
      typeof result.stream[Symbol.asyncIterator] !== "function"
    ) {
      throw new Error("Unexpected result format");
    }

    let res = "";

    // Send each chunk as it arrives
    for await (const chunk of result.stream) {
      const chunkText = await chunk.text();
      res += chunkText;
      console.log("Chunk:", chunkText);

      // Send each chunk to the content script
      chrome.runtime.sendMessage({ type: "stream", data: chunkText });
    }

    // Ensure the final chunk is sent before signaling end
  setTimeout(() => {
    chrome.runtime.sendMessage({ type: "streamEnd" });
    console.log("Final response:", res);
  }, 500);
   return { data: res, ok: true };
  } catch (err) {
    console.log("Error in getting response of prompt:", err);
    chrome.runtime.sendMessage({ type: "error", message: "gemini is dead" });
    return { data: null, ok: false };
  }
}

export { promptResponse };
