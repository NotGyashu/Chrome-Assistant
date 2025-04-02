import React from 'react';
import { useTheme } from "./ThemeContext";

const Welcome = () => {
  const { isDarkMode } = useTheme();
  const suggestions = [
    "Summarize this page",
    "Write a cover letter",
    "Explain this concept",
    "Help me debug this code"
  ];

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className={`text-xl font-bold ${
        isDarkMode ? 'text-theme-dark-accent' : 'text-theme-light-primary'
      }`}>
        How can I help you today?
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              isDarkMode
                ? 'bg-theme-dark-secondary hover:bg-theme-dark-primary'
                : 'bg-blue-50 hover:bg-theme-light-primary hover:text-white'
            }`}
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Welcome; 