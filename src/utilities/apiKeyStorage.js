/**
 * Secure API Key Storage Utility
 * Uses chrome.storage.sync for secure, cross-device storage
 */

const STORAGE_KEYS = {
  GEMINI_API_KEY: 'gemini_api_key',
  HUGGINGFACE_API_KEY: 'huggingface_api_key',
  KEYS_CONFIGURED: 'keys_configured'
};

/**
 * Save API keys to Chrome secure storage
 * @param {string} geminiKey - Gemini API key
 * @param {string} huggingfaceKey - HuggingFace API key
 * @returns {Promise<void>}
 */
export async function saveApiKeys(geminiKey, huggingfaceKey) {
  return new Promise((resolve, reject) => {
    const data = {
      [STORAGE_KEYS.GEMINI_API_KEY]: geminiKey,
      [STORAGE_KEYS.HUGGINGFACE_API_KEY]: huggingfaceKey,
      [STORAGE_KEYS.KEYS_CONFIGURED]: true
    };

    chrome.storage.sync.set(data, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        console.log('API keys saved successfully');
        resolve();
      }
    });
  });
}

/**
 * Retrieve the Gemini API key from storage
 * @returns {Promise<string|null>}
 */
export async function getGeminiApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([STORAGE_KEYS.GEMINI_API_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[STORAGE_KEYS.GEMINI_API_KEY] || null);
      }
    });
  });
}

/**
 * Retrieve the HuggingFace API key from storage
 * @returns {Promise<string|null>}
 */
export async function getHuggingfaceApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([STORAGE_KEYS.HUGGINGFACE_API_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[STORAGE_KEYS.HUGGINGFACE_API_KEY] || null);
      }
    });
  });
}

/**
 * Retrieve both API keys from storage
 * @returns {Promise<{geminiKey: string|null, huggingfaceKey: string|null}>}
 */
export async function getApiKeys() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      [STORAGE_KEYS.GEMINI_API_KEY, STORAGE_KEYS.HUGGINGFACE_API_KEY],
      (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve({
            geminiKey: result[STORAGE_KEYS.GEMINI_API_KEY] || null,
            huggingfaceKey: result[STORAGE_KEYS.HUGGINGFACE_API_KEY] || null
          });
        }
      }
    );
  });
}

/**
 * Check if API keys are configured
 * @returns {Promise<boolean>}
 */
export async function areKeysConfigured() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      [STORAGE_KEYS.GEMINI_API_KEY, STORAGE_KEYS.HUGGINGFACE_API_KEY, STORAGE_KEYS.KEYS_CONFIGURED],
      (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          // Check if both keys exist and keys_configured flag is true
          const hasKeys = 
            result[STORAGE_KEYS.KEYS_CONFIGURED] === true &&
            result[STORAGE_KEYS.GEMINI_API_KEY] &&
            result[STORAGE_KEYS.HUGGINGFACE_API_KEY];
          resolve(!!hasKeys);
        }
      }
    );
  });
}

/**
 * Clear all API keys from storage
 * @returns {Promise<void>}
 */
export async function clearApiKeys() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.remove(
      [
        STORAGE_KEYS.GEMINI_API_KEY,
        STORAGE_KEYS.HUGGINGFACE_API_KEY,
        STORAGE_KEYS.KEYS_CONFIGURED
      ],
      () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          console.log('API keys cleared successfully');
          resolve();
        }
      }
    );
  });
}

/**
 * Update only the Gemini API key
 * @param {string} geminiKey - New Gemini API key
 * @returns {Promise<void>}
 */
export async function updateGeminiApiKey(geminiKey) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [STORAGE_KEYS.GEMINI_API_KEY]: geminiKey }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        console.log('Gemini API key updated successfully');
        resolve();
      }
    });
  });
}

/**
 * Update only the HuggingFace API key
 * @param {string} huggingfaceKey - New HuggingFace API key
 * @returns {Promise<void>}
 */
export async function updateHuggingfaceApiKey(huggingfaceKey) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [STORAGE_KEYS.HUGGINGFACE_API_KEY]: huggingfaceKey }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        console.log('HuggingFace API key updated successfully');
        resolve();
      }
    });
  });
}
