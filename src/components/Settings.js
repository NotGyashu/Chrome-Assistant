import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { getApiKeys, saveApiKeys, clearApiKeys } from '../utilities/apiKeyStorage';

const Settings = ({ onBack }) => {
  const { isDarkMode } = useTheme();
  const [geminiKey, setGeminiKey] = useState('');
  const [huggingfaceKey, setHuggingfaceKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showHuggingfaceKey, setShowHuggingfaceKey] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    loadCurrentKeys();
  }, []);

  const loadCurrentKeys = async () => {
    try {
      const keys = await getApiKeys();
      // Show masked version of keys
      if (keys.geminiKey) {
        setGeminiKey(keys.geminiKey);
      }
      if (keys.huggingfaceKey) {
        setHuggingfaceKey(keys.huggingfaceKey);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading API keys:', err);
      setError('Failed to load API keys');
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!geminiKey.trim()) {
      setError('Gemini API key is required');
      return;
    }

    if (!huggingfaceKey.trim()) {
      setError('HuggingFace API key is required');
      return;
    }

    // Basic format validation
    if (!geminiKey.startsWith('AI')) {
      setError('Invalid Gemini API key format. Keys typically start with "AI"');
      return;
    }

    if (!huggingfaceKey.startsWith('hf_')) {
      setError('Invalid HuggingFace API key format. Keys should start with "hf_"');
      return;
    }

    setSaving(true);

    try {
      await saveApiKeys(geminiKey.trim(), huggingfaceKey.trim());
      setSuccess('API keys updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to update API keys. Please try again.');
      console.error('Error updating API keys:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleClearKeys = async () => {
    try {
      await clearApiKeys();
      setGeminiKey('');
      setHuggingfaceKey('');
      setSuccess('API keys cleared successfully. Please reload the extension.');
      setShowConfirmClear(false);
      
      // Reload after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError('Failed to clear API keys');
      console.error('Error clearing API keys:', err);
    }
  };

  const maskKey = (key) => {
    if (!key || key.length < 8) return key;
    return key.slice(0, 4) + '•'.repeat(key.length - 8) + key.slice(-4);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-2xl mx-auto p-6`}>
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className={`mr-3 p-2 rounded hover:bg-opacity-20 hover:bg-gray-500 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
            aria-label="Go back"
          >
            ← Back
          </button>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Settings
          </h1>
        </div>

        {/* Settings Form */}
        <div className={`p-6 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            API Keys Management
          </h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            {/* Gemini API Key */}
            <div>
              <label 
                htmlFor="gemini-key-setting" 
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  id="gemini-key-setting"
                  type={showGeminiKey ? 'text' : 'password'}
                  value={showGeminiKey ? geminiKey : maskKey(geminiKey)}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIza..."
                  disabled={saving}
                  onFocus={() => setShowGeminiKey(true)}
                  className={`w-full px-3 py-2 pr-10 rounded border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  disabled={saving}
                >
                  {showGeminiKey ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* HuggingFace API Key */}
            <div>
              <label 
                htmlFor="huggingface-key-setting" 
                className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                HuggingFace API Key
              </label>
              <div className="relative">
                <input
                  id="huggingface-key-setting"
                  type={showHuggingfaceKey ? 'text' : 'password'}
                  value={showHuggingfaceKey ? huggingfaceKey : maskKey(huggingfaceKey)}
                  onChange={(e) => setHuggingfaceKey(e.target.value)}
                  placeholder="hf_..."
                  disabled={saving}
                  onFocus={() => setShowHuggingfaceKey(true)}
                  className={`w-full px-3 py-2 pr-10 rounded border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                />
                <button
                  type="button"
                  onClick={() => setShowHuggingfaceKey(!showHuggingfaceKey)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  disabled={saving}
                >
                  {showHuggingfaceKey ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className={`p-3 rounded text-sm ${
                isDarkMode ? 'bg-green-900/50 text-green-200' : 'bg-green-50 text-green-800'
              }`}>
                ✓ {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className={`p-3 rounded text-sm ${
                isDarkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-50 text-red-800'
              }`}>
                {error}
              </div>
            )}

            {/* Update Button */}
            <button
              type="submit"
              disabled={saving}
              className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {saving ? 'Updating...' : 'Update API Keys'}
            </button>
          </form>

          {/* Danger Zone */}
          <div className={`mt-6 pt-6 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h3 className={`text-sm font-semibold mb-3 ${
              isDarkMode ? 'text-red-400' : 'text-red-600'
            }`}>
              Danger Zone
            </h3>
            
            {!showConfirmClear ? (
              <button
                onClick={() => setShowConfirmClear(true)}
                className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
                  isDarkMode
                    ? 'border-red-700 text-red-400 hover:bg-red-900/30'
                    : 'border-red-300 text-red-600 hover:bg-red-50'
                }`}
              >
                Clear All API Keys
              </button>
            ) : (
              <div className={`p-4 rounded ${
                isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
              }`}>
                <p className={`text-sm mb-3 ${
                  isDarkMode ? 'text-red-200' : 'text-red-800'
                }`}>
                  Are you sure? This will remove all API keys and you'll need to set them up again.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearKeys}
                    className={`px-4 py-2 rounded text-sm font-medium ${
                      isDarkMode
                        ? 'bg-red-700 hover:bg-red-800 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    Yes, Clear Keys
                  </button>
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className={`px-4 py-2 rounded text-sm font-medium border ${
                      isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <div className={`mt-4 p-3 rounded text-xs ${
            isDarkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'
          }`}>
            <p className="flex items-start">
              <span className="mr-2">🔒</span>
              <span>
                Your API keys are stored securely using Chrome's sync storage and are synced across your devices. 
                They are never sent to external servers except when making API calls to Google and HuggingFace.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
