import React from "react";

type P = { size?: number; color?: string; stroke?: number };

export const Check: React.FC<P> = ({ size = 40, color = "#fff", stroke = 5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4.5 12.5l5 5L19.5 7" stroke={color} strokeWidth={stroke * (24 / size) * 1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Download: React.FC<P> = ({ size = 40, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12M6.5 10l5.5 5.5L17.5 10M4 20h16" />
  </svg>
);

export const Face: React.FC<P> = ({ size = 40, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8V5.5A1.5 1.5 0 015.5 4H8M16 4h2.5A1.5 1.5 0 0120 5.5V8M20 16v2.5a1.5 1.5 0 01-1.5 1.5H16M8 20H5.5A1.5 1.5 0 014 18.5V16" />
    <circle cx="9.5" cy="10" r="0.6" fill={color} />
    <circle cx="14.5" cy="10" r="0.6" fill={color} />
    <path d="M9 14.5c1.6 1.4 4.4 1.4 6 0" />
  </svg>
);

export const Calendar: React.FC<P> = ({ size = 40, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4M8.5 14.5l2 2 4-4" />
  </svg>
);

export const Pin: React.FC<P> = ({ size = 40, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);
