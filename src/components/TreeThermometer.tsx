import React from "react";

interface TreeThermometerProps {
  progress: number;
}

const TreeThermometer: React.FC<TreeThermometerProps> = ({ progress }) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const fillPercent = clampedProgress * 100;
  const unfillPercent = 100 - fillPercent;

  return (
    <div className="relative h-full w-full">
      {/* Green-tinted version — clipped to show only the filled bottom portion */}
      <img
        src="/assets/tree.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain object-bottom"
        style={{
          clipPath: `inset(${unfillPercent}% 0 0 0)`,
          filter: "brightness(0.85) sepia(1) hue-rotate(80deg) saturate(3)",
          transition: "clip-path 1s ease-out",
        }}
      />
      {/* Normal version — clipped to show only the unfilled top portion */}
      <img
        src="/assets/tree.png"
        alt="Donation thermometer tree"
        className="absolute inset-0 h-full w-full object-contain object-bottom"
        style={{
          clipPath: `inset(0 0 ${fillPercent}% 0)`,
          transition: "clip-path 1s ease-out",
        }}
      />
    </div>
  );
};

export default TreeThermometer;
