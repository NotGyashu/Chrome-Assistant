import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { saveApiKeys } from '../utilities/apiKeyStorage';

const SetupScreen = ({ onSetupComplete }) => {
  const { isDarkMode } = useTheme();
  const [geminiKey, setGeminiKey] = useState('');
  const [huggingfaceKey, setHuggingfaceKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showHuggingfaceKey, setShowHuggingfaceKey] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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

    setLoading(true);

    try {
      await saveApiKeys(geminiKey.trim(), huggingfaceKey.trim());
      
      // Notify parent component that setup is complete
      if (onSetupComplete) {
        onSetupComplete();
      }
    } catch (err) {
      setError('Failed to save API keys. Please try again.');
      console.error('Error saving API keys:', err);
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome to Chrome Assistant</h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            To get started, please enter your API keys. Your keys are stored securely and never leave your device.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gemini API Key */}
          <div>
            <label 
              htmlFor="gemini-key" 
              className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Gemini API Key *
            </label>
            <div className="relative">
              <input
                id="gemini-key"
                type={showGeminiKey ? 'text' : 'password'}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIza..."
                disabled={loading}
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
                disabled={loading}
              >
                {showGeminiKey ? '🙈' : '👁️'}
              </button>
            </div>
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs mt-1 inline-block ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              Get your Gemini API key →
            </a>
          </div>

          {/* HuggingFace API Key */}
          <div>
            <label 
              htmlFor="huggingface-key" 
              className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              HuggingFace API Key *
            </label>
            <div className="relative">
              <input
                id="huggingface-key"
                type={showHuggingfaceKey ? 'text' : 'password'}
                value={huggingfaceKey}
                onChange={(e) => setHuggingfaceKey(e.target.value)}
                placeholder="hf_..."
                disabled={loading}
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
                disabled={loading}
              >
                {showHuggingfaceKey ? '🙈' : '👁️'}
              </button>
            </div>
            <a
              href="https://huggingface.co/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs mt-1 inline-block ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              Get your HuggingFace API key →
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`p-3 rounded text-sm ${
              isDarkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-50 text-red-800'
            }`}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? 'Saving...' : 'Save and Continue'}
          </button>
        </form>

        {/* Privacy Notice */}
        <div className={`mt-4 p-3 rounded text-xs ${
          isDarkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'
        }`}>
          <p className="flex items-start">
            <span className="mr-2">🔒</span>
            <span>
              Your API keys are stored locally in your browser using Chrome's secure storage. 
              They are never sent to our servers or shared with third parties.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
