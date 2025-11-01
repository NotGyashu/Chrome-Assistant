import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from chrome.storage.sync on mount
  useEffect(() => {
    chrome.storage.sync.get(['theme'], (result) => {
      if (result.theme) {
        setIsDarkMode(result.theme === 'dark');
      }
      setIsLoaded(true);
    });
  }, []);

  // Save theme to chrome.storage.sync when it changes
  useEffect(() => {
    if (isLoaded) {
      chrome.storage.sync.set({ theme: isDarkMode ? 'dark' : 'light' });
      
      // Apply dark class to document for Tailwind
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode, isLoaded]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);