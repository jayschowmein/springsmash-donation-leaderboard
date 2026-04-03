import React from "react";
import type { Division } from "../data/seed";

export type DivisionFilter = Division | "ALL";
export type BoardingFilter = "BOARDER" | "DAY" | "ALL";

interface SearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  divisionFilter: DivisionFilter;
  onDivisionChange: (value: DivisionFilter) => void;
  boardingFilter: BoardingFilter;
  onBoardingChange: (value: BoardingFilter) => void;
}

const chipBase =
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors";

const SearchFilters: React.FC<SearchFiltersProps> = ({
  search,
  onSearchChange,
  divisionFilter,
  onDivisionChange,
  boardingFilter,
  onBoardingChange
}) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by student or faculty name..."
          className="w-full rounded-2xl bg-jungle-800/80 border-2 border-jungle-500/40 px-4 sm:px-11 py-2.5 sm:py-3 text-sm sm:text-base text-stone-100 placeholder:text-stone-300/70 font-body shadow-soft-card focus:outline-none focus:ring-2 focus:ring-jungle-orange/60 focus:border-jungle-orange"
        />
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-jungle-400/80">
          🔍
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[0.7rem] sm:text-xs font-body">
        <span className="uppercase tracking-[0.18em] text-stone-200/80 mr-1.5 sm:mr-2">Quick Filters</span>
        <button
          type="button"
          onClick={() => onDivisionChange("ALL")}
          className={`${chipBase} ${
            divisionFilter === "ALL"
              ? "bg-jungle-orange text-white border-amber-600 shadow-bubble-sm"
              : "bg-jungle-800/80 border-jungle-500/50 text-stone-200 hover:bg-jungle-700/80"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => onDivisionChange("MS")}
          className={`${chipBase} ${
            divisionFilter === "MS"
              ? "bg-lime-400 text-black border-lime-500 shadow-bubble-sm"
              : "bg-jungle-800/80 border-lime-500/50 text-lime-100 hover:bg-jungle-700/80"
          }`}
        >
          MS
        </button>
        <button
          type="button"
          onClick={() => onDivisionChange("US")}
          className={`${chipBase} ${
            divisionFilter === "US"
              ? "bg-sky-400 text-black border-sky-500 shadow-bubble-sm"
              : "bg-jungle-800/80 border-sky-500/50 text-sky-100 hover:bg-jungle-700/80"
          }`}
        >
          US
        </button>
        <span className="mx-1 h-4 w-px bg-jungle-500/50" />
        <button
          type="button"
          onClick={() => onBoardingChange("ALL")}
          className={`${chipBase} ${
            boardingFilter === "ALL"
              ? "bg-jungle-orange text-white border-amber-600 shadow-bubble-sm"
              : "bg-jungle-800/80 border-jungle-500/50 text-stone-200 hover:bg-jungle-700/80"
          }`}
        >
          All Students
        </button>
        <button
          type="button"
          onClick={() => onBoardingChange("BOARDER")}
          className={`${chipBase} ${
            boardingFilter === "BOARDER"
              ? "bg-amber-400 text-black border-amber-500 shadow-bubble-sm"
              : "bg-jungle-800/80 border-amber-500/50 text-amber-100 hover:bg-jungle-700/80"
          }`}
        >
          Boarders
        </button>
        <button
          type="button"
          onClick={() => onBoardingChange("DAY")}
          className={`${chipBase} ${
            boardingFilter === "DAY"
              ? "bg-cyan-400 text-black border-cyan-500 shadow-bubble-sm"
              : "bg-jungle-800/80 border-cyan-500/50 text-cyan-100 hover:bg-jungle-700/80"
          }`}
        >
          Day Boys
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;

