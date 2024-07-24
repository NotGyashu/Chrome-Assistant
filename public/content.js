console.log("content script loaded");

import { marked } from "marked";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PROCESS_MARKDOWN") {
    const plainText = markdownToPlainText(message.markdown);
    sendResponse({ plainText });
  }
});


const markdownToPlainText = (markdown) => {
  const html = marked(markdown);
  const tempDiv = window.document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};