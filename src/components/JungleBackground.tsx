import React from "react";

/**
 * Cartoon jungle background: vines, palm leaves, trees, monkeys.
 * All elements are decorative only and sit behind main content.
 */
const JungleBackground: React.FC = () => {
  const green = "#166534";
  const greenLight = "#22c55e";
  const greenDark = "#14532d";
  const brown = "#78350f";
  const brownDark = "#451a03";
  const lionGold = "#facc15";
  const lionGoldDark = "#eab308";

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Left side: tall palm + vines */}
      <svg
        className="absolute left-0 bottom-0 w-64 h-[85vh] opacity-[0.55]"
        viewBox="0 0 200 400"
        fill="none"
      >
        {/* Palm trunk */}
        <path
          d="M85 400 L85 120 Q90 100 95 120 L95 400 Z"
          fill={brown}
          stroke={brownDark}
          strokeWidth="3"
        />
        {/* Palm fronds */}
        <path
          d="M95 120 Q20 80 10 100 Q30 130 95 125 Q160 130 180 100 Q170 80 95 120"
          fill={greenDark}
          stroke={green}
          strokeWidth="2"
        />
        <path
          d="M95 118 Q5 90 15 130 Q50 115 95 122 Q140 115 175 130 Q185 90 95 118"
          fill={green}
          stroke={greenDark}
          strokeWidth="1.5"
        />
        <path
          d="M95 122 Q40 60 70 95 Q95 85 95 122 Q95 85 120 95 Q150 60 95 122"
          fill={greenLight}
          stroke={green}
          strokeWidth="1"
          opacity="0.9"
        />
      </svg>

      {/* Left vine curl */}
      <svg
        className="absolute left-8 top-[15%] w-32 h-40 opacity-[0.5]"
        viewBox="0 0 120 160"
        fill="none"
      >
        <path
          d="M10 160 Q40 100 30 60 Q25 20 50 10 Q80 5 90 40 Q95 80 70 120 Q50 150 10 160"
          fill="none"
          stroke={green}
          strokeWidth="12"
          strokeLinecap="round"
        />
        <ellipse cx="50" cy="25" rx="18" ry="12" fill={greenDark} stroke={green} strokeWidth="1.5" />
        <ellipse cx="85" cy="55" rx="14" ry="10" fill={green} stroke={greenDark} strokeWidth="1" />
        <ellipse cx="75" cy="105" rx="16" ry="11" fill={greenDark} stroke={green} strokeWidth="1" />
      </svg>

      {/* Right side: tree + hanging vines */}
      <svg
        className="absolute right-0 bottom-0 w-72 h-[80vh] opacity-[0.5]"
        viewBox="0 0 250 380"
        fill="none"
      >
        {/* Tree trunk */}
        <path
          d="M160 380 L160 100 Q165 80 170 100 L170 380 Z"
          fill={brown}
          stroke={brownDark}
          strokeWidth="4"
        />
        <path
          d="M155 380 L155 120 Q158 100 160 120 L160 380 Z"
          fill={brownDark}
          opacity="0.6"
        />
        {/* Foliage blob */}
        <ellipse cx="165" cy="85" rx="55" ry="45" fill={greenDark} stroke={green} strokeWidth="2" />
        <ellipse cx="155" cy="75" rx="35" ry="30" fill={green} opacity="0.8" />
        <ellipse cx="185" cy="90" rx="28" ry="25" fill={greenLight} opacity="0.6" />
        {/* Hanging vine */}
        <path
          d="M200 100 Q210 180 190 260 Q185 300 200 340"
          fill="none"
          stroke={green}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <ellipse cx="195" cy="265" rx="15" ry="11" fill={greenDark} stroke={green} strokeWidth="1" />
        <ellipse cx="202" cy="320" rx="12" ry="9" fill={green} stroke={greenDark} strokeWidth="1" />
      </svg>

      {/* Top-right vines and leaves */}
      <svg
        className="absolute right-4 top-0 w-48 h-56 opacity-[0.45]"
        viewBox="0 0 180 200"
        fill="none"
      >
        <path
          d="M180 0 Q120 40 100 80 Q90 120 120 160 Q140 180 100 200"
          fill="none"
          stroke={green}
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M170 20 Q130 50 110 90 Q105 130 130 165"
          fill="none"
          stroke={greenDark}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <ellipse cx="105" cy="85" rx="20" ry="14" fill={greenDark} stroke={green} strokeWidth="1" />
        <ellipse cx="125" cy="155" rx="18" ry="13" fill={green} stroke={greenDark} strokeWidth="1" />
        {/* Big leaf */}
        <path
          d="M0 60 Q50 50 90 60 Q100 80 85 100 Q50 95 10 85 Q0 70 0 60"
          fill={green}
          stroke={greenDark}
          strokeWidth="2"
        />
      </svg>

      {/* Bottom-left: banana-style leaves */}
      <svg
        className="absolute left-0 bottom-0 w-52 h-48 opacity-[0.5]"
        viewBox="0 0 180 140"
        fill="none"
      >
        <path
          d="M0 140 Q30 100 20 60 Q15 20 50 10 Q90 0 120 30 Q150 60 140 100 Q130 140 90 130 Q40 120 0 140"
          fill={greenDark}
          stroke={green}
          strokeWidth="2"
        />
        <path
          d="M20 130 Q55 90 60 50 Q65 15 95 20 Q130 30 125 70 Q120 110 80 120 Q35 125 20 130"
          fill={green}
          stroke={greenDark}
          strokeWidth="1.5"
          opacity="0.85"
        />
      </svg>

      {/* Monkey bottom-left - cartoon silhouette */}
      <svg
        className="absolute left-6 bottom-24 w-16 h-16 opacity-[0.4]"
        viewBox="0 0 64 64"
        fill="none"
      >
        <ellipse cx="32" cy="42" rx="18" ry="14" fill={brownDark} stroke={brown} strokeWidth="1.5" />
        <circle cx="32" cy="22" r="14" fill={brownDark} stroke={brown} strokeWidth="1.5" />
        <ellipse cx="26" cy="20" rx="3" ry="2.5" fill="#1c1917" />
        <ellipse cx="38" cy="20" rx="3" ry="2.5" fill="#1c1917" />
        <path
          d="M18 38 Q8 45 12 52 Q18 50 22 42"
          fill="none"
          stroke={brown}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M46 38 Q56 45 52 52 Q46 50 42 42"
          fill="none"
          stroke={brown}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M28 28 Q32 32 36 28" fill="none" stroke={brownDark} strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Monkey top-right - different pose */}
      <svg
        className="absolute right-8 top-28 w-14 h-14 opacity-[0.35]"
        viewBox="0 0 56 56"
        fill="none"
      >
        <circle cx="28" cy="20" r="12" fill={brownDark} stroke={brown} strokeWidth="1.5" />
        <ellipse cx="28" cy="38" rx="14" ry="10" fill={brownDark} stroke={brown} strokeWidth="1.5" />
        <ellipse cx="24" cy="18" rx="2.5" ry="2" fill="#1c1917" />
        <ellipse cx="32" cy="18" rx="2.5" ry="2" fill="#1c1917" />
        <path
          d="M14 22 Q4 28 8 36 Q14 34 18 26"
          fill="none"
          stroke={brown}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M42 22 Q52 28 48 36 Q42 34 38 26"
          fill="none"
          stroke={brown}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {/* Small bird/parrot silhouette - top left */}
      <svg
        className="absolute left-24 top-20 w-12 h-10 opacity-[0.3]"
        viewBox="0 0 48 40"
        fill="none"
      >
        <ellipse cx="24" cy="22" rx="14" ry="10" fill={greenDark} stroke={green} strokeWidth="1" />
        <path
          d="M10 20 Q5 15 8 10 Q12 12 14 18"
          fill={green}
          stroke={greenDark}
          strokeWidth="1"
        />
        <path
          d="M38 20 Q43 15 40 10 Q36 12 34 18"
          fill={green}
          stroke={greenDark}
          strokeWidth="1"
        />
        <path d="M28 18 L35 14 L32 20" fill={greenLight} opacity="0.8" />
      </svg>

      {/* Central decorative leaves - very subtle */}
      <svg
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-64 opacity-[0.12]"
        viewBox="0 0 320 180"
        fill="none"
      >
        <path
          d="M160 90 Q80 60 40 90 Q60 120 160 90 Q260 120 280 90 Q240 60 160 90"
          fill={greenDark}
        />
        <path
          d="M160 95 Q100 70 70 100 Q90 130 160 95 Q230 130 250 100 Q220 70 160 95"
          fill={green}
          opacity="0.7"
        />
      </svg>

      {/* Right mid: extra vine with leaves */}
      <svg
        className="absolute right-20 top-1/4 w-28 h-44 opacity-[0.4]"
        viewBox="0 0 100 160"
        fill="none"
      >
        <path
          d="M80 0 Q50 50 60 100 Q65 140 40 160"
          fill="none"
          stroke={green}
          strokeWidth="11"
          strokeLinecap="round"
        />
        <ellipse cx="58" cy="55" rx="13" ry="10" fill={greenDark} stroke={green} strokeWidth="1" />
        <ellipse cx="62" cy="105" rx="12" ry="9" fill={green} stroke={greenDark} strokeWidth="1" />
      </svg>

      {/* Lion silhouette - bottom right */}
      <svg
        className="absolute right-6 bottom-10 w-18 h-18 opacity-[0.4]"
        viewBox="0 0 72 64"
        fill="none"
      >
        {/* Body */}
        <ellipse cx="36" cy="40" rx="20" ry="14" fill={lionGoldDark} stroke={lionGold} strokeWidth="1.8" />
        {/* Head / mane */}
        <circle cx="26" cy="24" r="9" fill={lionGoldDark} />
        <circle cx="26" cy="24" r="12" fill={lionGold} opacity="0.9" />
        {/* Face */}
        <circle cx="26" cy="25" r="6" fill="#fef9c3" />
        <ellipse cx="24" cy="24" rx="1.8" ry="2.1" fill="#1c1917" />
        <ellipse cx="28" cy="24" rx="1.8" ry="2.1" fill="#1c1917" />
        <path d="M23 28 Q26 30 29 28" stroke="#854d0e" strokeWidth="1.4" strokeLinecap="round" />
        {/* Tail */}
        <path
          d="M50 38 Q60 34 62 26 Q63 22 59 20"
          fill="none"
          stroke={lionGoldDark}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M58 18 Q62 18 63 22 Q59 22 58 18" fill={lionGoldDark} />
      </svg>
    </div>
  );
};

export default JungleBackground;
