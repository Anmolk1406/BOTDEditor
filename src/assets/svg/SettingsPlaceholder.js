import React from "react";

export default function SettingsPlaceholder(props) {
  return (
    <svg width={props.width || 32} height={props.height || 32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="16" cy="16" r="16" fill="#E0E0E0" />
      <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="10" fill="#888">Settings</text>
    </svg>
  );
} 