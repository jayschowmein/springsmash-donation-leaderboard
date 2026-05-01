import React from "react";

type Prize = {
  rank: string;
  prize: string;
  icon: string;
  gold?: boolean;
};

const MEDAL_LABEL: Record<string, string> = {
  "1st": "1",
  "2nd": "2",
  "3rd": "3",
};

const MEDAL_COLORS: Record<string, string> = {
  "1st": "from-amber-400 to-amber-600 text-amber-900",
  "2nd": "from-slate-300 to-slate-400 text-slate-900",
  "3rd": "from-amber-600 to-amber-800 text-amber-100",
};

const PrizeBanner: React.FC<{ prizes: Prize[] }> = ({ prizes }) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2.5">
      {prizes.map(({ rank, prize, icon, gold }) => {
        const medalLabel = MEDAL_LABEL[rank] ?? "★";
        const medalColors =
          MEDAL_COLORS[rank] ?? "from-jungle-500 to-jungle-700 text-white";
        const isFirst = rank === "1st" || (gold && prizes.length === 1);

        return (
          <div
            key={rank}
            className={`relative flex flex-1 min-w-[100px] flex-col items-center gap-2 rounded-2xl px-3 py-3.5 text-center
              ${
                isFirst
                  ? "border-2 border-amber-400/60 bg-gradient-to-b from-amber-900/50 via-jungle-800/70 to-jungle-900/80 shadow-[0_0_18px_rgba(251,191,36,0.18)]"
                  : "border border-jungle-500/30 bg-jungle-800/60"
              }`}
          >
            {/* rank badge */}
            <div
              className={`absolute -top-2.5 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-gradient-to-b ${medalColors} flex items-center justify-center font-bubble text-[0.55rem] shadow-md ring-1 ring-black/20`}
            >
              {medalLabel}
            </div>

            {/* icon */}
            <span
              className={`mt-1 leading-none select-none ${isFirst ? "text-4xl" : "text-3xl"}`}
              role="img"
              aria-label={prize}
            >
              {icon}
            </span>

            {/* prize name */}
            <span
              className={`font-bubble leading-tight ${
                isFirst ? "text-[0.75rem] text-amber-200" : "text-[0.7rem] text-stone-300"
              }`}
            >
              {prize}
            </span>

            {isFirst && (
              <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-amber-300/20" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PrizeBanner;
