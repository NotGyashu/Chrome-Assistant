/**
 * Conversation Memory Storage Utility
 * Manages conversation history using chrome.storage.local
 */

const STORAGE_KEY = 'conversation_history';

/**
 * Message structure for conversation memory
 * @typedef {Object} ConversationMessage
 * @property {string} id - Unique message ID
 * @property {string} userMessage - User's prompt
 * @property {string} aiResponse - AI's response
 * @property {number} timestamp - Unix timestamp
 * @property {Array<number>} [embedding] - Optional embedding vector
 */

/**
 * Save a conversation message to storage
 * @param {string} userMessage - User's message
 * @param {string} aiResponse - AI's response
 * @param {Array<number>} [embedding] - Optional embedding
 * @returns {Promise<ConversationMessage>}
 */
export async function saveConversationMessage(userMessage, aiResponse, embedding = null) {
  try {
    const history = await getConversationHistory();
    
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userMessage,
      aiResponse,
      timestamp: Date.now(),
      embedding
    };
    
    history.push(message);
    
    // Keep only last 100 messages to avoid storage limits
    if (history.length > 100) {
      history.shift();
    }
    
    await setConversationHistory(history);
    return message;
  } catch (error) {
    console.error('Error saving conversation message:', error);
    throw error;
  }
}

/**
 * Get all conversation history
 * @returns {Promise<Array<ConversationMessage>>}
 */
export async function getConversationHistory() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[STORAGE_KEY] || []);
      }
    });
  });
}

/**
 * Set conversation history (internal use)
 * @param {Array<ConversationMessage>} history
 * @returns {Promise<void>}
 */
async function setConversationHistory(history) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [STORAGE_KEY]: history }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Clear all conversation history
 * @returns {Promise<void>}
 */
export async function clearConversationHistory() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove([STORAGE_KEY], () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        console.log('Conversation history cleared');
        resolve();
      }
    });
  });
}

/**
 * Get recent messages for context
 * @param {number} count - Number of recent messages to retrieve
 * @returns {Promise<Array<ConversationMessage>>}
 */
export async function getRecentMessages(count = 10) {
  try {
    const history = await getConversationHistory();
    return history.slice(-count);
  } catch (error) {
    console.error('Error getting recent messages:', error);
    return [];
  }
}

/**
 * Search conversation history by text
 * @param {string} searchText - Text to search for
 * @returns {Promise<Array<ConversationMessage>>}
 */
export async function searchConversationHistory(searchText) {
  try {
    const history = await getConversationHistory();
    const searchLower = searchText.toLowerCase();
    
    return history.filter(msg => 
      msg.userMessage.toLowerCase().includes(searchLower) ||
      msg.aiResponse.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Error searching conversation history:', error);
    return [];
  }
}

/**
 * Get conversation context for AI (formatted for Gemini)
 * @param {number} messageCount - Number of recent messages
 * @returns {Promise<Array<Object>>}
 */
export async function getConversationContext(messageCount = 5) {
  try {
    const recentMessages = await getRecentMessages(messageCount);
    
    // Format for Gemini chat history
    return recentMessages.flatMap(msg => [
      { role: 'user', parts: [{ text: msg.userMessage }] },
      { role: 'model', parts: [{ text: msg.aiResponse }] }
    ]);
  } catch (error) {
    console.error('Error getting conversation context:', error);
    return [];
  }
}

/**
 * Get statistics about conversation history
 * @returns {Promise<Object>}
 */
export async function getConversationStats() {
  try {
    const history = await getConversationHistory();
    
    return {
      totalMessages: history.length,
      oldestMessage: history[0]?.timestamp || null,
      newestMessage: history[history.length - 1]?.timestamp || null,
      storageUsed: JSON.stringify(history).length
    };
  } catch (error) {
    console.error('Error getting conversation stats:', error);
    return {
      totalMessages: 0,
      oldestMessage: null,
      newestMessage: null,
      storageUsed: 0
    };
  }
}
