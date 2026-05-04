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
    <div className="mb-4 flex flex-wrap gap-3">
      {prizes.map(({ rank, prize, icon, gold }) => {
        const medalLabel = MEDAL_LABEL[rank] ?? "★";
        const medalColors =
          MEDAL_COLORS[rank] ?? "from-jungle-500 to-jungle-700 text-white";
        const isFirst = rank === "1st" || (gold && prizes.length === 1);

        return (
          <div
            key={rank}
            className={`relative flex flex-1 min-w-[110px] flex-col items-center gap-2 rounded-2xl px-3 pt-5 pb-4 text-center
              ${
                isFirst
                  ? "border-2 border-amber-400/65 bg-gradient-to-b from-amber-900/55 via-jungle-800/75 to-jungle-900/85 shadow-[0_0_26px_rgba(251,191,36,0.30),0_8px_22px_rgba(0,0,0,0.55)]"
                  : "border border-jungle-500/35 bg-gradient-to-b from-jungle-800/65 to-jungle-900/80 shadow-[0_4px_16px_rgba(0,0,0,0.50)]"
              }`}
          >
            {/* rank badge — larger for legibility */}
            <div
              className={`absolute -top-3.5 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-gradient-to-b ${medalColors} flex items-center justify-center font-bubble text-[0.65rem] font-bold shadow-lg ring-2 ring-black/30`}
            >
              {medalLabel}
            </div>

            {/* icon */}
            <span
              className={`leading-none select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] ${isFirst ? "text-4xl" : "text-3xl"}`}
              role="img"
              aria-label={prize}
            >
              {icon}
            </span>

            {/* prize name */}
            <span
              className={`font-bubble leading-tight ${
                isFirst ? "text-[0.8rem] text-amber-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" : "text-[0.72rem] text-stone-300"
              }`}
            >
              {prize}
            </span>

            {isFirst && (
              <>
                <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-amber-300/25" />
                {/* shimmer highlight at top edge */}
                <span className="pointer-events-none absolute top-0 left-[22%] right-[22%] h-px bg-gradient-to-r from-transparent via-amber-300/55 to-transparent rounded-full" />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PrizeBanner;
