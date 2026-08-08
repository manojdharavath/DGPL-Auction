// frontend/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HashRouter } from "react-router-dom";
// Use a default import for AuthProvider
import AuthProvider from "./context/AuthContext.jsx"; // provider; context core separated for ESLint fast refresh
import SocketProvider from "./context/SocketContext.jsx"; // add socket provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
