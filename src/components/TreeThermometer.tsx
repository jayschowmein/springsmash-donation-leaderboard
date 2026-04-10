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
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="treeBarkGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#472b1f" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
        <clipPath id="trunkClip">
          <path d="M108 160 C100 180 96 220 98 270 C98 300 100 316 104 320 L156 320 C160 316 162 300 162 270 C164 220 160 180 152 160 Z" />
        </clipPath>
      </defs>

      <path
        d="M68 162 C28 162 34 108 56 94 C36 90 34 50 82 46 C76 24 118 10 148 24 C172 6 226 20 214 68 C250 60 256 116 214 132 C238 136 236 178 184 190 C174 230 132 218 108 232 C60 250 28 216 46 184 C30 196 22 170 52 166 Z"
        fill="#166534"
        stroke="#134e4a"
        strokeWidth="3"
      />
      <path
        d="M112 170 C102 170 102 220 104 265 C104 290 104 312 106 320 L154 320 C156 312 156 290 156 265 C158 220 158 170 148 170 Z"
        fill="url(#treeBarkGradient)"
      />
      <path
        d="M108 160 C96 180 94 210 96 240 C96 270 100 300 106 320 L154 320 C160 300 164 270 164 240 C166 210 164 180 152 160 Z"
        fill="none"
        stroke="#374151"
        strokeWidth="4"
      />
      <rect
        x="110"
        y={fillY}
        width="40"
        height={fillHeight}
        fill="url(#treeFillGradient)"
        clipPath="url(#trunkClip)"
        rx="18"
        ry="18"
      />
      <path
        d="M120 170 C122 180 122 192 120 202 M140 170 C138 180 138 192 140 202"
        stroke="#a8a29e"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M98 76 C92 54 86 32 112 34 C128 30 150 44 148 70 C168 70 176 82 170 96 C194 96 206 110 196 126 C204 132 206 146 196 152 C184 178 156 168 138 178 C116 180 102 166 88 156 C70 142 74 118 98 124 Z"
        fill="#22c55e"
        opacity="0.95"
      />
      <path
        d="M86 110 C78 96 84 82 98 80 M168 100 C162 90 166 80 174 78 M126 98 C118 88 120 78 130 72"
        stroke="#d9f99d"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="88" cy="110" r="12" fill="#4d7c0f" opacity="0.8" />
      <circle cx="152" cy="100" r="14" fill="#4d7c0f" opacity="0.85" />
      <circle cx="126" cy="70" r="18" fill="#4d7c0f" opacity="0.9" />
    </svg>
  );
};

export default TreeThermometer;
