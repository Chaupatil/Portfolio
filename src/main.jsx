import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { useGLTF } from "@react-three/drei";

// This is valid, `useGLTF.preload` is a static method
useGLTF.preload("/assets/models/astronaut.glb");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
