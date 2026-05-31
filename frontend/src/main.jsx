import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LangProvider } from "./context/LangContext.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import "./index.css";

// Apply saved language direction before first render
const savedLang = localStorage.getItem("lang") || "en";
document.documentElement.setAttribute("dir", savedLang === "fa" ? "rtl" : "ltr");
document.documentElement.setAttribute("lang", savedLang);
if (savedLang === "fa") document.documentElement.classList.add("rtl");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <LangProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LangProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
