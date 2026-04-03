import React, { useMemo, useState } from "react";
import type { Faculty, Student, WeekKey } from "../data/seed";

const PASSCODE = "SACSMASH2026";

type TargetType = "student" | "faculty";

interface AdminLogEntry {
  id: string;
  timestamp: number;
  targetType: TargetType;
  targetId: string;
  weekKey: WeekKey;
  amount: number;
  note?: string;
  previousTotals: {
    overall: number;
    week1: number;
    week2: number;
    week3: number;
    week4: number;
  };
}

export interface AdminPanelProps {
  students: Student[];
  faculty: Faculty[];
  onApplyUpdate: (
    targetType: TargetType,
    targetId: string,
    weekKey: WeekKey,
    amount: number,
    note?: string
  ) => void;
  onUndoLast: () => void;
  onResetAll: () => void;
  lastEntry?: AdminLogEntry | null;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  students,
  faculty,
  onApplyUpdate,
  onUndoLast,
  onResetAll,
  lastEntry
}) => {
  const [unlocked, setUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");

  const [targetType, setTargetType] = useState<TargetType>("student");
  const [targetId, setTargetId] = useState<string>("");
  const [weekKey, setWeekKey] = useState<WeekKey>("overall");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectableStudents = useMemo(
    () =>
      [...students].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      ),
    [students]
  );

  const selectableFaculty = useMemo(
    () =>
      [...faculty].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      ),
    [faculty]
  );

  const handleUnlock = () => {
    if (passcodeInput.trim() === PASSCODE) {
      setUnlocked(true);
      setError(null);
    } else {
      setError("Incorrect passcode. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const parsedAmount = Number(amount);
    if (!targetId) {
      setError("Please select a student or faculty member.");
      return;
    }
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a positive amount to add.");
      return;
    }

    onApplyUpdate(targetType, targetId, weekKey, parsedAmount, note.trim() || undefined);
    setSuccess("Donation applied successfully.");
    setAmount("");
    setNote("");
  };

  const lastSummary = useMemo(() => {
    if (!lastEntry) return null;
    const baseTarget =
      lastEntry.targetType === "student"
        ? students.find((s) => s.id === lastEntry.targetId)
        : faculty.find((f) => f.id === lastEntry.targetId);
    const label = baseTarget?.name ?? lastEntry.targetId;
    return `${label}: +$${lastEntry.amount.toLocaleString()} to ${
      lastEntry.weekKey === "overall" ? "Overall" : lastEntry.weekKey.replace("week", "Week ")
    }`;
  }, [lastEntry, students, faculty]);

  return (
    <div className="rounded-3xl bg-gradient-to-r from-red-900/90 via-jungle-800/95 to-amber-900/85 border border-red-400/60 shadow-soft-card overflow-hidden">
      <div className="px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 bg-black/40">
        <div>
          <h2 className="font-display text-xl sm:text-2xl text-red-100 tracking-wide drop-shadow">
            Admin: Update Donations
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm text-red-100/80">
            Passcode-protected panel for manual leaderboard updates.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-red-500/15 border border-red-300/70 px-3 py-1 text-[0.65rem] sm:text-xs uppercase tracking-[0.22em] text-red-100">
          Admin Only
        </span>
      </div>

      {!unlocked ? (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 sm:pt-4 space-y-3">
          <p className="text-sm text-red-50/90">
            Enter the passcode to unlock donation editing tools. This does not provide real security
            and is for event admin convenience only.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              type="password"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              placeholder="Enter admin passcode"
              className="flex-1 rounded-2xl bg-black/60 border border-red-400/60 px-4 py-2.5 text-sm text-red-50 placeholder:text-red-100/60 focus:outline-none focus:ring-2 focus:ring-red-400/80"
            />
            <button
              type="button"
              onClick={handleUnlock}
              className="font-bubble inline-flex justify-center rounded-2xl bg-gradient-to-r from-amber-400 via-jungle-orange to-jungle-orange-dark text-white font-bold px-5 py-2.5 text-sm shadow-bubble-sm hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              Unlock Panel
            </button>
          </div>
          {error ? <p className="text-xs text-red-200">{error}</p> : null}
        </div>
      ) : (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 sm:pt-4 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="space-y-1.5">
                <span className="block text-[0.7rem] uppercase tracking-[0.2em] text-red-100/80">
                  Target Type
                </span>
                <div className="inline-flex rounded-full bg-black/40 border border-red-400/60 p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetType("student");
                      setTargetId("");
                    }}
                    className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                      targetType === "student"
                        ? "bg-red-400 text-black"
                        : "text-red-100/80 hover:bg-red-400/15"
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetType("faculty");
                      setTargetId("");
                    }}
                    className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                      targetType === "faculty"
                        ? "bg-red-400 text-black"
                        : "text-red-100/80 hover:bg-red-400/15"
                    }`}
                  >
                    Faculty
                  </button>
                </div>
              </div>

              <div className="flex-1 min-w-[180px] space-y-1.5">
                <label className="block text-[0.7rem] uppercase tracking-[0.2em] text-red-100/80">
                  Select Person
                </label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full rounded-2xl bg-black/60 border border-red-400/60 px-3 py-2.5 text-xs sm:text-sm text-red-50 focus:outline-none focus:ring-2 focus:ring-red-400/80"
                >
                  <option value="">Choose...</option>
                  {(targetType === "student" ? selectableStudents : selectableFaculty).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[0.7rem] uppercase tracking-[0.2em] text-red-100/80">
                  Bucket
                </label>
                <select
                  value={weekKey}
                  onChange={(e) => setWeekKey(e.target.value as WeekKey)}
                  className="rounded-2xl bg-black/60 border border-red-400/60 px-3 py-2.5 text-xs sm:text-sm text-red-50 focus:outline-none focus:ring-2 focus:ring-red-400/80"
                >
                  <option value="overall">Overall Only</option>
                  <option value="week1">Week 1 (+ Overall)</option>
                  <option value="week2">Week 2 (+ Overall)</option>
                  <option value="week3">Week 3 (+ Overall)</option>
                  <option value="week4">Week 4 (+ Overall)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[0.7rem] uppercase tracking-[0.2em] text-red-100/80">
                  Amount to Add ($)
                </label>
                <input
                  type="number"
                  min={0}
                  step={5}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-28 sm:w-32 rounded-2xl bg-black/60 border border-red-400/60 px-3 py-2.5 text-xs sm:text-sm text-red-50 focus:outline-none focus:ring-2 focus:ring-red-400/80"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[0.7rem] uppercase tracking-[0.2em] text-red-100/80">
                Optional Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="e.g., House competition, Advisory challenge, Parent match..."
                className="w-full rounded-2xl bg-black/60 border border-red-400/60 px-3 py-2 text-xs sm:text-sm text-red-50 placeholder:text-red-100/60 focus:outline-none focus:ring-2 focus:ring-red-400/80"
              />
            </div>

            {error ? <p className="text-xs text-red-200">{error}</p> : null}
            {success ? <p className="text-xs text-lime-200 font-body">{success}</p> : null}

            <div className="flex flex-wrap items-center gap-3 justify-between pt-1">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-400 via-amber-300 to-emerald-300 text-black font-semibold px-5 py-2.5 text-sm shadow-soft-card hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                Apply Donation
              </button>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onUndoLast}
                  disabled={!lastEntry}
                  className={`inline-flex items-center rounded-2xl border px-3 py-2 text-xs font-semibold tracking-wide ${
                    lastEntry
                      ? "border-amber-300/80 text-amber-50 hover:bg-amber-400/15"
                      : "border-amber-200/40 text-amber-100/50 cursor-not-allowed"
                  }`}
                >
                  Undo Last Entry
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirmReset) {
                      setConfirmReset(true);
                    } else {
                      setConfirmReset(false);
                      onResetAll();
                    }
                  }}
                  className="inline-flex items-center rounded-2xl border border-red-300/80 px-3 py-2 text-xs font-semibold tracking-wide text-red-50 hover:bg-red-500/15"
                >
                  {confirmReset ? "Tap to Confirm Reset" : "Reset All Data"}
                </button>
              </div>
            </div>

            {lastSummary ? (
              <p className="text-[0.7rem] text-red-100/80 pt-1">
                Last entry: <span className="font-semibold">{lastSummary}</span>
              </p>
            ) : null}
          </form>
        </div>
      )}
    </div>
  );
};

export type { AdminLogEntry, TargetType };

export default AdminPanel;

