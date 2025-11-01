import React from 'react';
import { useTheme } from "./ThemeContext";

const Welcome = () => {
  const { isDarkMode } = useTheme();
  const suggestions = [
    { text: "Summarize this page", icon: "📄" },
    { text: "Write a cover letter", icon: "✉️" },
    { text: "Explain this concept", icon: "💡" },
    { text: "Help me debug this code", icon: "🐛" }
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-6 min-h-[400px] message-enter">
      {/* Animated Halloween Header */}
      <div className="text-center space-y-4">
        <div className="text-6xl animate-bounce" style={{ animationDuration: '2s' }}>
          🎃
        </div>
        <h1 className={`text-3xl font-bold bg-gradient-to-r ${
          isDarkMode 
            ? 'from-orange-500 via-purple-500 to-orange-500' 
            : 'from-orange-600 via-purple-600 to-orange-600'
        } bg-clip-text text-transparent animate-pulse`}>
          Chrome Assistant
        </h1>
        <p className={`text-lg ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          How can I help you today?
        </p>
      </div>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`group p-4 rounded-2xl cursor-pointer transition-all duration-300 card-halloween message-slide ${
              isDarkMode
                ? 'hover:bg-gradient-to-br hover:from-orange-900/30 hover:to-purple-900/30'
                : 'hover:bg-gradient-to-br hover:from-orange-100 hover:to-purple-100'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                {suggestion.icon}
              </span>
              <span className={`font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {suggestion.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="flex gap-4 text-3xl opacity-50">
        <span className="animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>👻</span>
        <span className="animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '2s' }}>🦇</span>
        <span className="animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '2s' }}>🕷️</span>
      </div>
    </div>
  );
};

export default Welcome; 