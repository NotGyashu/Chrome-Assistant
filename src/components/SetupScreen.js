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
    <div className={`flex items-center justify-center min-h-screen p-6 gradient-bg ${
      isDarkMode ? 'text-white' : 'bg-gradient-to-br from-purple-50 to-orange-50 text-gray-900'
    }`}>
      <div className="w-full max-w-xl card-halloween rounded-2xl p-8 shadow-2xl backdrop-blur-xl message-enter">
        {/* Header */}
        <div className="mb-8 text-center space-y-4">
          <div className="text-6xl animate-bounce" style={{ animationDuration: '2s' }}>
            🎃
          </div>
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${
            isDarkMode 
              ? 'from-orange-500 via-purple-500 to-orange-500' 
              : 'from-orange-600 via-purple-600 to-orange-600'
          } bg-clip-text text-transparent`}>
            Welcome to Chrome Assistant
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            🔐 To get started, please enter your API keys below. Your keys are stored securely in Chrome's encrypted storage.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gemini API Key */}
          <div className="message-slide">
            <label 
              htmlFor="gemini-key" 
              className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-purple-300' : 'text-purple-700'
              }`}
            >
              🤖 Gemini API Key *
            </label>
            <div className="relative">
              <input
                id="gemini-key"
                type={showGeminiKey ? 'text' : 'password'}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIza..."
                disabled={loading}
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
                disabled={loading}
              >
                {showGeminiKey ? '🙈' : '👁️'}
              </button>
            </div>
            <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              Get your key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">Google AI Studio →</a>
            </p>
          </div>

          {/* HuggingFace API Key */}
          <div className="message-slide" style={{ animationDelay: '0.1s' }}>
            <label 
              htmlFor="huggingface-key" 
              className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-purple-300' : 'text-purple-700'
              }`}
            >
              🤗 HuggingFace API Key *
            </label>
            <div className="relative">
              <input
                id="huggingface-key"
                type={showHuggingfaceKey ? 'text' : 'password'}
                value={huggingfaceKey}
                onChange={(e) => setHuggingfaceKey(e.target.value)}
                placeholder="hf_..."
                disabled={loading}
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
                disabled={loading}
              >
                {showHuggingfaceKey ? '🙈' : '👁️'}
              </button>
            </div>
            <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              Get your key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">HuggingFace Settings →</a>
            </p>
          </div>

          {/* Error Message */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 message-slide ${
              loading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'btn-halloween text-white shadow-2xl hover:shadow-orange-500/50'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Saving Keys...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>🚀</span>
                Save and Continue
              </span>
            )}
          </button>
        </form>

        {/* Privacy Notice */}
        <div className={`mt-6 p-4 rounded-xl backdrop-blur-sm message-slide ${
          isDarkMode ? 'bg-purple-900/20 border border-purple-700/30' : 'bg-purple-100/50 border border-purple-300'
        }`} style={{ animationDelay: '0.3s' }}>
          <div className="flex items-start gap-3">
            <span className="text-xl">🔒</span>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <strong className={isDarkMode ? 'text-purple-300' : 'text-purple-700'}>Privacy First:</strong> Your API keys are stored locally in Chrome's secure encrypted storage. 
              They never leave your browser except when making authorized API calls to Google and HuggingFace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
