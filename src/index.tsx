import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import "./Assets/globals.css";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
