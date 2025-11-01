/**
 * Message Types for Chrome Extension Communication
 * Centralized message type constants to ensure consistency
 */

export const MessageType = {
  // Lifecycle events
  POPUP_MOUNTED: 'popupMounted',
  
  // AI Communication
  PROMPT: 'prompt',
  STREAM: 'stream',
  STREAM_END: 'streamEnd',
  ERROR: 'error',
  
  // Side Panel
  OPEN_SIDE_PANEL: 'open_side_panel',
  EXPAND_PANEL: 'expand_panel',
  
  // Utility
  PING: 'ping'
};

/**
 * Validates that a message has the required structure
 * @param {object} message - The message to validate
 * @returns {boolean} - Whether the message is valid
 */
export function validateMessage(message) {
  if (!message || typeof message !== 'object') {
    console.error('Invalid message: not an object', message);
    return false;
  }
  
  if (typeof message.type !== 'string') {
    console.error('Invalid message: type is not a string', message);
    return false;
  }
  
  if (!Object.values(MessageType).includes(message.type)) {
    console.warn('Unknown message type:', message.type);
    // Don't return false - allow unknown types for extensibility
  }
  
  return true;
}

/**
 * Creates a properly formatted message
 * @param {string} type - Message type from MessageType enum
 * @param {object} data - Additional data for the message
 * @returns {object} - Formatted message
 */
export function createMessage(type, data = {}) {
  return {
    type,
    ...data
  };
}
