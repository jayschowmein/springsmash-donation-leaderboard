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
      {/* White silhouette — always visible as the "empty" outline */}
      <img
        src="/assets/tree.png"
        alt="Donation thermometer tree"
        className="absolute inset-0 h-full w-full object-contain object-bottom"
        style={{
          filter: "brightness(0) invert(1)",
          opacity: 0.25,
        }}
      />
      {/* Actual tree image — fills from the bottom as progress increases */}
      <img
        src="/assets/tree.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain object-bottom"
        style={{
          clipPath: `inset(${unfillPercent}% 0 0 0)`,
          transition: "clip-path 1s ease-out",
        }}
      />
    </div>
  );
};

export default TreeThermometer;
