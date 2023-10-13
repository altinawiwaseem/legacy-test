import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./components/Context/UserContext";
import { TestContextProvider } from "./components/Context/TestContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <UserContextProvider>
      <TestContextProvider>
        <App />
      </TestContextProvider>
    </UserContextProvider>
  </BrowserRouter>
);
