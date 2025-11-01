import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./components/ThemeContext";
import Popup from "./components/Popup";
import "./index.css";

// Initialize the root component with all providers
const App = () => {
  return (
    <ThemeProvider>
      <Popup />
    </ThemeProvider>
  );
};

// Create root and render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);