import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

const ColorModeSwitcher = () => {
  const { toggleTheme, theme } = useContext(ThemeContext);

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    toggleTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
  };

  return (
    <select className="select-theme" value={theme} onChange={handleThemeChange}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="high-contrast">High Contrast</option>
    </select>
  );
};

export default ColorModeSwitcher;
