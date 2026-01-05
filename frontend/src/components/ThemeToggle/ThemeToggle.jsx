import { Sun, Moon } from "lucide-react";
import { useState } from "react";
import "./ThemeToggle.css";

// src/components/ThemeToggle/ThemeToggle.jsx
function ThemeToggle({ toggleTheme, currentTheme }) {
  return (
    <button onClick={toggleTheme} className="theme-toggle-btn">
      {currentTheme === "light" ? "🌞" : "🌜"}
    </button>
  );
}

export default ThemeToggle;

