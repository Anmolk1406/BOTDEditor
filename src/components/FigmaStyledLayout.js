import React from "react";

export default function FigmaStyledLayout({ children, lottieContent, controlsContent }) {
  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "#141414",
      fontFamily: "'Chakra Petch', sans-serif",
      display: "flex",
      padding: "40px",
      gap: "40px",
      boxSizing: "border-box",
    }}>
      {/* Left Side - Lottie Animation */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#2A2A2A",
        borderRadius: 16,
        minHeight: "600px",
        padding: "60px",
        position: "relative",
        overflow: "visible"
      }}>
        {lottieContent || (
          <div style={{
            color: "#666",
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: "1px"
          }}>
            LOTTIE HERE
          </div>
        )}
      </div>

      {/* Right Side - Controls */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        maxWidth: "600px"
      }}>
        {controlsContent || children}
      </div>
    </div>
  );
} 