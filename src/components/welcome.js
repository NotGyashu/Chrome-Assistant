import React from 'react'

const Welcome = () => {
  return (
 
            <div className="flex flex-col flex-grow  items-center m-1">
              <div className="w-full flex justify-between items-center p-2 text-sm">
                <div className="text-xl">
                  <span>Hii! </span>
                  <span>How can I help you Today?</span>
                </div>
              </div>
              <div className="flex w-full gap-2 rounded-md p-2">
                <div className="p-2 border  rounded-lg">Summarize the help</div>
                <div className="p-2 border  rounded-lg">
                 write a cover letter
                </div>
                <div className="p-2 border  rounded-lg">Make Maths question paper of class 9</div>
              </div>
            </div>
         
  )
}


export default Welcome