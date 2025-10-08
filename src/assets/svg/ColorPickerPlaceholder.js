import React from "react";

export default function ColorPickerPlaceholder(props) {
  return (
    <svg width={props.width || 32} height={props.height || 32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="4" y="4" width="24" height="24" rx="6" fill="#E0E0E0" />
      <circle cx="16" cy="16" r="8" fill="#BDBDBD" />
      <text x="50%" y="85%" textAnchor="middle" fontSize="8" fill="#888">Color</text>
    </svg>
  );
} 