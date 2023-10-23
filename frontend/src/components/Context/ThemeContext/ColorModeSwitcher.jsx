import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

const ColorModeSwitcher = () => {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <select onChange={(e) => toggleTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="high-contrast">High Contrast</option>
    </select>
  );
};

export default ColorModeSwitcher;
