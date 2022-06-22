import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
// import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <Router>
    <App />
  </Router>
);
