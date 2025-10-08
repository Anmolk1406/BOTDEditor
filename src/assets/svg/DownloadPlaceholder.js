import React from "react";

export default function DownloadPlaceholder(props) {
  return (
    <svg width={props.width || 32} height={props.height || 32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="32" height="32" rx="8" fill="#E0E0E0" />
      <path d="M16 8v10M16 18l-4-4m4 4l4-4" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="50%" y="90%" textAnchor="middle" fontSize="8" fill="#888">DL</text>
    </svg>
  );
} 