import React, { ReactNode, useState } from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, subtitle, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="relative rounded-3xl bg-jungle-900/65 border-2 border-jungle-500/25 shadow-soft-card overflow-hidden backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-jungle-800/95 via-jungle-700/90 to-jungle-600/80"
      >
        <div className="text-left">
          <h2 className="heading-bubble text-lg sm:text-xl md:text-2xl tracking-wide">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 text-xs sm:text-sm text-stone-200/85 font-body">{subtitle}</p>
          ) : null}
        </div>
        <div className="ml-4 flex items-center gap-2">
          <span className="hidden sm:inline text-xs font-body uppercase tracking-[0.2em] text-stone-200/80">
            {open ? "Hide" : "Show"}
          </span>
          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-jungle-800/80 border-2 border-jungle-400/50 text-jungle-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </div>
      </button>
      <div
        className={`transition-[max-height,opacity] duration-400 ease-out ${
          open ? "max-h-[999px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4">{children}</div>
      </div>
    </section>
  );
};

export default SectionCard;

