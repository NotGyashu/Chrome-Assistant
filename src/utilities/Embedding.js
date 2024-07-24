import { HfInference } from "@huggingface/inference";
import { conversationMemory } from "../../public/background";


const hf = new HfInference("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");
export async function getembdedtext(text){
  const embedding = await hf.featureExtraction({
    model: "ggrn/e5-small-v2",
    inputs: text,
  });
  return embedding;

}


function calculateCosineSimilarity(a, b) {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length for cosine similarity.");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0; // Handle cases where a vector has all zeros
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function findMostSimilarContext(newEmbedding) {
  let mostSimilarContext = null;
  let highestSimilarity = -1; // Start with a low similarity score
  console.log("finding similarity");
  for (const messageId in conversationMemory) {
    const storedEmbedding = conversationMemory[messageId].embedding; // Get the stored embedding
    const similarity = calculateCosineSimilarity(newEmbedding, storedEmbedding);

    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      mostSimilarContext = conversationMemory[messageId].text; // Store the text
    }
  }
 console.log(highestSimilarity);
  // You might want to add a similarity threshold here:
  if (highestSimilarity > 0.8) {
    // Example threshold - adjust as needed
    console.log(mostSimilarContext)
    return mostSimilarContext;
  } else {
    return null; // Or a default message like "No relevant context found."
  }
}

//enhaced prmpt
export async function enhancedPrompt(message) {
  //console.log("reached in enhanced prompt");
  try {
    // 1. Generate embedding for the new message
    const newMessageEmbedding = await getembdedtext(message);
    //console.log("emdedd  text", newMessageEmbedding);
    // 2. Find the most similar context (if any)
    const mostSimilarContext = findMostSimilarContext(newMessageEmbedding);
    console.log("similarity context found", mostSimilarContext);
    // 3. Enhance the prompt
    const enhancedPrompt = mostSimilarContext
      ? `${mostSimilarContext}\n\n${message}`
      : message;
    console.log("enhancedprompt", enhancedPrompt);
    return { prompt: enhancedPrompt };
  } catch (error) {
    console.error("Error in enhancing prompt: in enhanced prompt", error);
    return { error: error.message };
  }
}


