import React from "react";

export default function LogoPlaceholder(props) {
  return (
    <svg width={props.width || 64} height={props.height || 64} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="64" height="64" rx="12" fill="#E0E0E0" />
      <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="16" fill="#888">Logo</text>
    </svg>
  );
} 