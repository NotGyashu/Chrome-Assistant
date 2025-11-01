/**
 * Utility functions for React components
 */

/**
 * Closes the current window without clearing storage
 * This preserves conversation history and settings
 */
export const handleClose = () => {
  // Don't clear storage - conversation history should persist
  console.log("Closing window (storage preserved)");
  window.close();
};





