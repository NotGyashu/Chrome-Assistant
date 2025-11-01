import { HfInference } from "@huggingface/inference";
import { getHuggingfaceApiKey } from "./apiKeyStorage";
import { getConversationHistory } from "./conversationMemory";

let hfClient = null;

/**
 * Initialize the HuggingFace client with API key from storage
 */
async function initializeHfClient() {
  if (!hfClient) {
    const apiKey = await getHuggingfaceApiKey();
    if (!apiKey) {
      throw new Error("HuggingFace API key not found. Please configure your API keys in settings.");
    }
    hfClient = new HfInference(apiKey);
  }
  return hfClient;
}

export async function getembdedtext(text){
  try {
    const hf = await initializeHfClient();
    const embedding = await hf.featureExtraction({
      model: "ggrn/e5-small-v2",
      inputs: text,
    });
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
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

async function findMostSimilarContext(newEmbedding) {
  try {
    const conversationHistory = await getConversationHistory();
    
    if (!conversationHistory || conversationHistory.length === 0) {
      return null;
    }
    
    let mostSimilarContext = null;
    let highestSimilarity = -1;
    
    console.log("Finding similarity in", conversationHistory.length, "messages");
    
    for (const message of conversationHistory) {
      if (!message.embedding || !Array.isArray(message.embedding)) {
        continue; // Skip messages without embeddings
      }
      
      try {
        const similarity = calculateCosineSimilarity(newEmbedding, message.embedding);
        
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          mostSimilarContext = `Previous context:\nUser: ${message.userMessage}\nAI: ${message.aiResponse}`;
        }
      } catch (err) {
        console.error('Error calculating similarity:', err);
        continue;
      }
    }
    
    console.log('Highest similarity:', highestSimilarity);
    
    // Similarity threshold
    if (highestSimilarity > 0.8) {
      console.log('Found similar context');
      return mostSimilarContext;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error in findMostSimilarContext:', error);
    return null;
  }
}

//enhanced prompt function
export async function enhancedPrompt(message) {
  try {
    // 1. Generate embedding for the new message
    const newMessageEmbedding = await getembdedtext(message);
    
    // 2. Find the most similar context (if any)
    const mostSimilarContext = await findMostSimilarContext(newMessageEmbedding);
    console.log("similarity context found", mostSimilarContext);
    
    // 3. Enhance the prompt with context if found
    const enhancedPrompt = mostSimilarContext
      ? `${mostSimilarContext}\n\n${message}`
      : message;
    console.log("enhanced prompt", enhancedPrompt);
    
    return { prompt: enhancedPrompt };
  } catch (error) {
    console.error("Error in enhancing prompt:", error);
    return { error: error.message };
  }
}

