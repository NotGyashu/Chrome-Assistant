import { getAIModel } from "./getAiModal.js";


async function promptResponse(prompt) {
  console.log("prompt controller", prompt);
  try {
    const model = getAIModel();
    const prompt = prompt;
    const result = await model.generateContent(prompt);

    // Assuming result.response is a valid object and you need to extract text
    const response = await result.response; // If result.response is a promise, await it
    res.status(200).json({ data: response.text() }); // Corrected to use `status` instead of `Status`
    console.log(response.text());
  } catch (err) {
    console.log("Error in getting response of prompt:", err);
    res.status(500).send("Internal Server Error"); // Send a proper error response
  }
}

export { promptResponse };
