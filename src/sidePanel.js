import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import SidePanel from "./components/sidepanel";
import { ThemeProvider } from "./components/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <SidePanel />
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root2"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);