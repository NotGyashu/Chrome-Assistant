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
      <div className={`flex items-center justify-center h-full gradient-bg ${
        isDarkMode ? 'text-white' : 'bg-gradient-to-br from-purple-50 to-orange-50 text-gray-900'
      }`}>
        <div className="text-center space-y-4 message-enter">
          <div className="text-5xl animate-spin">⚙️</div>
          <div className="text-lg font-medium">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full overflow-auto custom-scrollbar gradient-bg ${
      isDarkMode ? 'text-gray-100' : 'bg-gradient-to-br from-purple-50 to-orange-50 text-gray-900'
    }`}>
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-8 message-enter">
          <button
            onClick={onBack}
            className={`mr-4 p-3 rounded-xl transition-all duration-300 glow-purple ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-700 to-purple-800 text-white hover:from-purple-600 hover:to-purple-700' 
                : 'bg-gradient-to-r from-purple-200 to-purple-300 text-purple-900 hover:from-purple-300 hover:to-purple-400'
            }`}
            aria-label="Go back"
          >
            ← Back
          </button>
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${
            isDarkMode 
              ? 'from-orange-500 via-purple-500 to-orange-500' 
              : 'from-orange-600 via-purple-600 to-orange-600'
          } bg-clip-text text-transparent`}>
            ⚙️ Settings
          </h1>
        </div>

        {/* Settings Form */}
        <div className="card-halloween rounded-2xl p-6 shadow-2xl message-slide backdrop-blur-xl">
          <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
            isDarkMode ? 'text-orange-400' : 'text-orange-700'
          }`}>
            <span>🔑</span>
            <span>API Keys Management</span>
          </h2>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Gemini API Key */}
            <div className="message-slide" style={{ animationDelay: '0.1s' }}>
              <label 
                htmlFor="gemini-key-setting" 
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? 'text-purple-300' : 'text-purple-700'
                }`}
              >
                🤖 Gemini API Key
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
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-900/50 border-purple-700/50 text-gray-100 placeholder-gray-500 focus:border-orange-500 focus:bg-gray-900/70' 
                      : 'bg-white/80 border-purple-300 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:bg-white'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:opacity-50`}
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 text-lg transition-all ${
                    isDarkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'
                  }`}
                  disabled={saving}
                >
                  {showGeminiKey ? '🙈' : '👁️'}
                </button>
              </div>
              <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                Get your key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">Google AI Studio</a>
              </p>
            </div>

            {/* HuggingFace API Key */}
            <div className="message-slide" style={{ animationDelay: '0.2s' }}>
              <label 
                htmlFor="huggingface-key-setting" 
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? 'text-purple-300' : 'text-purple-700'
                }`}
              >
                🤗 HuggingFace API Key
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
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-900/50 border-purple-700/50 text-gray-100 placeholder-gray-500 focus:border-orange-500 focus:bg-gray-900/70' 
                      : 'bg-white/80 border-purple-300 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:bg-white'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/30 disabled:opacity-50`}
                />
                <button
                  type="button"
                  onClick={() => setShowHuggingfaceKey(!showHuggingfaceKey)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 text-lg transition-all ${
                    isDarkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-orange-600'
                  }`}
                  disabled={saving}
                >
                  {showHuggingfaceKey ? '🙈' : '👁️'}
                </button>
              </div>
              <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                Get your key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">HuggingFace Settings</a>
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className={`p-4 rounded-xl border-2 message-enter ${
                isDarkMode 
                  ? 'bg-red-900/20 border-red-700 text-red-300' 
                  : 'bg-red-50 border-red-400 text-red-700'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <span className="font-semibold">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className={`p-4 rounded-xl border-2 message-enter ${
                isDarkMode 
                  ? 'bg-green-900/20 border-green-700 text-green-300' 
                  : 'bg-green-50 border-green-400 text-green-700'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <span className="font-semibold">{success}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 message-slide" style={{ animationDelay: '0.3s' }}>
              <button
                type="submit"
                disabled={saving}
                className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  saving
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'btn-halloween text-white shadow-lg hover:shadow-orange-500/50'
                }`}
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>💾</span>
                    Update Keys
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmClear(true)}
                disabled={saving}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                  saving
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-red-900/50 text-red-300 hover:bg-red-900/70 border-2 border-red-700'
                      : 'bg-red-100 text-red-700 hover:bg-red-200 border-2 border-red-400'
                }`}
              >
                🗑️ Clear
              </button>
            </div>
          </form>
        </div>

        {/* Confirm Clear Dialog */}
        {showConfirmClear && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmClear(false)}></div>
            <div className={`relative card-halloween rounded-2xl p-6 max-w-md w-full shadow-2xl message-enter ${
              isDarkMode ? 'border-2 border-red-700' : 'border-2 border-red-400'
            }`}>
              <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
                isDarkMode ? 'text-red-400' : 'text-red-700'
              }`}>
                <span>⚠️</span>
                <span>Confirm Clear Keys</span>
              </h3>
              <p className={`text-sm mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Are you sure you want to clear all API keys? You'll need to set them up again to use the extension.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleClearKeys}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-red-900/50 text-red-300 hover:bg-red-900/70 border-2 border-red-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  Yes, Clear All
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-purple-900/50 text-purple-300 hover:bg-purple-900/70 border-2 border-purple-700'
                      : 'bg-purple-200 text-purple-900 hover:bg-purple-300 border-2 border-purple-400'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className={`mt-6 card-halloween rounded-2xl p-5 shadow-lg message-slide ${
          isDarkMode ? 'border border-purple-700/30' : 'border border-purple-300'
        }`} style={{ animationDelay: '0.4s' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h3 className={`font-semibold mb-2 ${
                isDarkMode ? 'text-purple-300' : 'text-purple-700'
              }`}>
                Privacy & Security
              </h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Your API keys are stored securely using Chrome's sync storage and synced across your devices. 
                They are never sent to external servers except when making authorized API calls to Google and HuggingFace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
