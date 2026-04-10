import React from "react";
import type { Division } from "../data/seed";

interface ProfileRowProps {
  rank: number;
  name: string;
  grade?: number;
  houseOrClan?: string;
  divisionLabel?: Division;
  isBoarder?: boolean;
  total?: number;
  isFaculty?: boolean;
}

const getBadge = (rank: number) => {
  if (rank === 1) return { label: "#1", color: "bg-amber-400 text-black", ring: "ring-amber-300/80" };
  if (rank === 2) return { label: "#2", color: "bg-slate-200 text-slate-900", ring: "ring-slate-100/80" };
  if (rank === 3) return { label: "#3", color: "bg-orange-300 text-slate-900", ring: "ring-orange-200/80" };
  return null;
};

const ProfileRow: React.FC<ProfileRowProps> = ({
  rank,
  name,
  grade,
  houseOrClan,
  divisionLabel,
  isBoarder,
  total,
  isFaculty
}) => {
  const badge = getBadge(rank);

  return (
    <div className="group relative flex items-center gap-3 sm:gap-4 rounded-2xl bg-gradient-to-r from-jungle-800/90 via-jungle-700/85 to-jungle-600/80 border-2 border-jungle-500/25 px-3 sm:px-4 py-2.5 sm:py-3.5 shadow-soft-card overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(74,222,128,0.12),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(34,197,94,0.08),transparent_55%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative flex items-center justify-center shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-jungle-900/80 border-2 border-jungle-400/40 text-jungle-400 font-bubble text-lg sm:text-xl">
        {rank}
      </div>

      <div className="relative flex-1 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <p className="font-body font-semibold text-sm sm:text-base md:text-lg truncate text-stone-100">{name}</p>
          {badge ? (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.16em] ring-2 ${badge.color} ${badge.ring}`}
            >
              {badge.label}
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[0.7rem] sm:text-xs text-stone-200/90 font-body">
          {isFaculty ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-sky-400/20 border border-sky-300/40 text-sky-100 uppercase tracking-[0.18em] text-[0.6rem]">
              Faculty
            </span>
          ) : (
            <>
              {typeof grade === "number" ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-jungle-500/20 border border-jungle-400/40">
                  <span className="uppercase tracking-[0.16em] text-[0.6rem] text-jungle-400/95">Grade&nbsp;</span>
                  <span className="font-semibold text-stone-100">{grade}</span>
                </span>
              ) : null}
              {divisionLabel ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-lime-500/15 border border-lime-400/40 uppercase tracking-[0.18em] text-[0.6rem] text-lime-100">
                  {divisionLabel === "US" ? "Upper School" : "Middle School"}
                </span>
              ) : null}
              {houseOrClan ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-jungle-400/15 border border-jungle-400/35 text-[0.6rem] text-jungle-400">
                  {houseOrClan}
                </span>
              ) : null}
              {typeof isBoarder === "boolean" ? (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[0.6rem] uppercase tracking-[0.18em] ${
                    isBoarder
                      ? "bg-amber-400/10 border-amber-300/50 text-amber-100"
                      : "bg-cyan-400/10 border-cyan-300/50 text-cyan-100"
                  }`}
                >
                  {isBoarder ? "Boarder" : "Day Boy"}
                </span>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileRow;

