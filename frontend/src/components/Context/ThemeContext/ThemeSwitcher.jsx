import React, { useContext, useEffect, useRef, useState } from "react";
import "./ThemeSwitcher.css";
import { ThemeContext } from "./ThemeContext";

const ThemeSwitcher = ({ onThemeChange }) => {
  const { toggleTheme, theme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const themeSwitcherRef = useRef(null);

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    toggleTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        themeSwitcherRef.current &&
        !themeSwitcherRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`theme-switcher`} ref={themeSwitcherRef}>
      <button className={`${theme}`} onClick={() => setIsOpen(!isOpen)}>
        {" "}
        ▼
      </button>
      {isOpen && (
        <div className={`dropdown-menu`}>
          <button value="light" onClick={handleThemeChange}>
            ☀️ Light
          </button>
          <button value="dark" onClick={handleThemeChange}>
            🌙 Dark
          </button>
          <button value="high-contrast" onClick={handleThemeChange}>
            ⚫️ High Contrast
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
