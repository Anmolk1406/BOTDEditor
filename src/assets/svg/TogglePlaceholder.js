import React from "react";

export default function TogglePlaceholder(props) {
  return (
    <svg width={props.width || 40} height={props.height || 24} viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2" y="2" width="36" height="20" rx="10" fill="#E0E0E0" />
      <circle cx="12" cy="12" r="8" fill="#BDBDBD" />
      <text x="75%" y="60%" textAnchor="middle" fontSize="8" fill="#888">Toggle</text>
    </svg>
  );
} 