import * as tf from "@tensorflow/tfjs";
import * as use from "@tensorflow-models/universal-sentence-encoder";

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

function findMostSimilarContext(newEmbedding, conversationMemory) {
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

  // You might want to add a similarity threshold here:
  if (highestSimilarity > 0.8) {
    // Example threshold - adjust as needed
    return mostSimilarContext;
  } else {
    return null; // Or a default message like "No relevant context found."
  }
}

//enhaced prmpt
export async function enhancedPrompt(
  message,
  embeddingModel,
  conversationMemory
) {
  console.log("reached in enhanced prompt");
  try {
    // 1. Generate embedding for the new message
    const newMessageEmbedding = await generateEmbedding(
      message.prompt,
      embeddingModel
    );
    console.log("emdedding model loaded");
    // 2. Find the most similar context (if any)
    const mostSimilarContext = findMostSimilarContext(
      newMessageEmbedding,
      conversationMemory
    );
    console.log("similarity found");
    // 3. Enhance the prompt
    const enhancedPrompt = mostSimilarContext
      ? `${mostSimilarContext}\n\n${message.prompt}`
      : message.prompt;
    return { prompt: enhancedPrompt };
  } catch (error) {
    console.error("Error in enhancing prompt: in enhanced prompt", error);
    return { error: error.message };
  }
}

//get embedded text
export async function generateEmbedding(text, embeddingModel) {
  if (!embeddingModel) {
    console.error("Embedding model not loaded yet!");
    return null;
  }

  try {
    const embeddings = await embeddingModel.embed([text]);

    const embeddingArray = embeddings.arraySync()[0];

    return embeddingArray;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
}

//get embedding model
export async function loadEmbeddingModel() {
  try {
    const model = await use.load();
    console.log("Universal Sentence Encoder loaded successfully!");
    return model;
  } catch (error) {
    console.error("Error loading Universal Sentence Encoder:", error);
  }
}

