import React from "react";
import "../assets/box.css";

export default function GlassBox({ children }) {
  return (
    <div className="glassmorphism"> {children}</div>
  );
}
