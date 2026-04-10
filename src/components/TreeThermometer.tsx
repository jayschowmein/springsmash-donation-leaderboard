import React from "react";

interface TreeThermometerProps {
  progress: number;
}

const TreeThermometer: React.FC<TreeThermometerProps> = ({ progress }) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const trunkHeight = 160;
  const fillHeight = clampedProgress * trunkHeight;
  const fillY = 160 + (trunkHeight - fillHeight);

  return (
    <svg viewBox="0 0 260 360" className="h-full w-full">
      <defs>
        <linearGradient id="treeFillGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <clipPath id="trunkClip">
          <path d="M106 160 C94 160 92 220 96 320 L164 320 C168 220 166 160 154 160 Z" />
        </clipPath>
      </defs>

      <rect x="96" y="160" width="68" height="160" fill="#111827" rx="28" ry="28" />
      <rect
        x="100"
        y={fillY}
        width="60"
        height={fillHeight}
        fill="url(#treeFillGradient)"
        clipPath="url(#trunkClip)"
        rx="20"
        ry="20"
      />

      <path
        d="M68 160 C20 160 24 112 44 102 C20 94 20 20 100 32 C100 0 170 14 164 82 C220 70 236 120 196 142 C210 148 214 172 198 178 C222 190 214 220 178 220 C160 240 120 228 92 232 C46 248 18 216 36 180 C22 190 16 172 42 168 Z"
        fill="#f8fafc"
        stroke="#d1d5db"
        strokeWidth="3"
      />
      <path
        d="M106 160 C94 160 92 220 96 320 L164 320 C168 220 166 160 154 160 Z"
        fill="none"
        stroke="#d1d5db"
        strokeWidth="4"
      />
      <circle cx="112" cy="104" r="16" fill="#ffffff" opacity="0.8" />
      <circle cx="158" cy="88" r="18" fill="#ffffff" opacity="0.85" />
      <circle cx="142" cy="132" r="14" fill="#ffffff" opacity="0.75" />
      <circle cx="88" cy="118" r="14" fill="#ffffff" opacity="0.75" />
      <circle cx="120" cy="72" r="10" fill="#ffffff" opacity="0.8" />
    </svg>
  );
};

export default TreeThermometer;
