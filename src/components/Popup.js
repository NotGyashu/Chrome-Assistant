import React, { useState, useEffect } from "react";
import Prompt from "./Prompt";
import { handleClose,Minimize,openWithSidepanel } from "../utilities/reactUtilities";
import { callBackgroundScript } from "../utilities/chromeApiUtilities";

const Popup = () => {

  const [summaries, setSummaries] = useState([]);
  const [expand, setExpand] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ready,setReady] = useState(false);
  const [initialMessage,setInitialMessage] = useState("Loading...")

  useEffect(() => {
    // Send a message to the background script
    chrome.runtime.sendMessage({ type: "popupMounted" }, (response) => {
      if (response && response.status === 200) {
        setReady(true);
        console.log("working");
      } else {
        setInitialMessage(response.message);
      }
    });

    // Cleanup the listener when the component is unmounted
    return () => {
      chrome.runtime.onMessage.removeListener();
    };
  }, []);

  useEffect(() => {
    const handleResponse = (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error sending message from popup to background script:",
          chrome.runtime.lastError.message
        );
        setSummaries((prevSummaries) => [
          ...prevSummaries,
          "Error in extracting the page in popup",
        ]);
        setIsLoading(false);
      } else {
        console.log(
          "Received response to popup from background script:",
          response
        );
        if (response.summary && response.summary != "")
          setSummaries((prevSummaries) => [...prevSummaries, response.summary]);
        if (response.isFinal) {
          setIsLoading(false); // Stop loading when all summaries are received
        }
      }
    };

    if (expand) {
      chrome.runtime.onMessage.addListener(handleResponse);
    }

    return () => {
      chrome.runtime.onMessage.removeListener(handleResponse);
    };
  }, [expand]);

  
  

  return (
    <div className=" w-[700px] font-sans max-h-[600px]  overflow-hidden">
      {!ready ? (
        <div className="flex justify-center items-center m-auto ">
          {initialMessage}
        </div>
      ) : (
        <div className=" flex flex-col h-full w-full  items-center">
          <div className="w-full  flex justify-between items-center p-2 text-sm">
            <div className="text-xl">
              <span>Hii [Name]! </span>
              <span>How i can help u with web page</span>
            </div>
            <div className="text-xs flex gap-1 cursor-pointer">
              <div
                onClick={() => {
                  openWithSidepanel();
                }}
              >
                spt
              </div>
              <div
                onClick={() => {
                  Minimize();
                }}
              >
                min
              </div>
              <div
                onClick={() => {
                  handleClose();
                }}
              >
                cut
              </div>
            </div>
          </div>
          <div className="flex w-full gap-2   rounded-md p-2">
            <div className="p-2 border flex-grow rounded-lg">
              summarize the help{" "}
            </div>
            <div className="p-2 border flex-grow rounded-lg  ">
              give me all list of this page
            </div>
            <div className="p-2 border flex-grow rounded-lg  ">
              do somr thing else{" "}
            </div>
          </div>
          <div className="w-full p-1">
            <Prompt />
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
