import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/variables.css";
import "./styles/theme.css";
import "./styles/styles.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./components/Context/UserContext/UserContext";
import { TestContextProvider } from "./components/Context/TestContext/TestContext";
import { ThemeProvider } from "./components/Context/ThemeContext/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ThemeProvider>
      <UserContextProvider>
        <TestContextProvider>
          <App />
        </TestContextProvider>
      </UserContextProvider>
    </ThemeProvider>
  </BrowserRouter>
);
