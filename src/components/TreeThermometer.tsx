import React from "react";

interface TreeThermometerProps {
  progress: number;
}

const TreeThermometer: React.FC<TreeThermometerProps> = ({ progress }) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const fillPercent = clampedProgress * 100;

  return (
    <div className="relative h-full w-full">
      {/* Green thermometer fill rising from the bottom */}
      <div
        className="absolute inset-x-0 bottom-0 rounded-b-[2rem] transition-all duration-1000 ease-out"
        style={{
          height: `${fillPercent}%`,
          background: "linear-gradient(to top, #16a34a, #5eead4)",
          mixBlendMode: "multiply",
          opacity: 0.75,
        }}
      />
      {/* Tree image */}
      <img
        src="/assets/tree.png"
        alt="Donation thermometer tree"
        className="relative h-full w-full object-contain object-bottom"
        style={{ mixBlendMode: "normal" }}
      />
    </div>
  );
};

export default TreeThermometer;
