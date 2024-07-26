import React, { useState, useEffect } from "react";
import Prompt from "./Prompt";
import { handleClose, Minimize } from "../utilities/reactUtilities";
import { conversationMemory } from "../../public/background";

const SidePanel = () => {
  const [ready, setReady] = useState(false);
  const [initialMessage, setInitialMessage] = useState("Loading...");

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "popupMounted" }, (response) => {
      if (response && response.status === 200) {
        setReady(true);
        console.log("Popup is ready");
      } else {
        setInitialMessage(response.message);
      }
    });

    return () => {
      chrome.runtime.onMessage.removeListener();
    };
  }, []);

  const handleOpenSidePanel = () => {
    chrome.storage.local.set(
      {
        sidePanelData: Array.isArray(conversationMemory)
          ? conversationMemory
          : [],
      },
      () => {
        console.log("Data saved to storage");
        chrome.runtime.sendMessage({ type: "open_side_panel" });
        window.close();
      }
    );
  };

  return (
    <>
      {!ready ? (
        <div className="flex justify-center items-center m-auto">
          {initialMessage}
        </div>
      ) : (
        <div className="flex flex-col h-full w-full overflow-scroll py-1  custom-scrollbar">
          <div className="text-xs flex gap-3 cursor-pointer absolute top-2 right-3">
            <div onClick={handleOpenSidePanel}>ops</div>
            <div onClick={handleClose}>X</div>
          </div>

          <div className="w-full h-full flex-grow  ">
            <Prompt />
          </div>
        </div>
      )}
    </>
  );
};

export default SidePanel;
