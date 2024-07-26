import { conversationMemory } from "../../public/background";

export const handleClose = () => {
chrome.storage.local.clear(() => {
  console.log("All data cleared from local storage.");
});


window.close();

};





