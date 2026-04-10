import React, { useEffect, useMemo, useState } from "react";
import {
  seedStudents,
  seedFaculty,
  type Student,
  type Faculty,
  type WeekKey
} from "./data/seed";
import SectionCard from "./components/SectionCard";
import ProfileRow from "./components/ProfileRow";
import SearchFilters, {
  type BoardingFilter,
  type DivisionFilter
} from "./components/SearchFilters";
import AdminPanel, {
  type AdminLogEntry,
  type TargetType
} from "./components/AdminPanel";
import JungleBackground from "./components/JungleBackground";

const LS_KEY_STUDENTS = "springsmash_students_v1";
const LS_KEY_FACULTY = "springsmash_faculty_v1";
const LS_KEY_LOG = "springsmash_admin_log_v1";

const cloneStudents = (data: Student[]): Student[] => JSON.parse(JSON.stringify(data));
const cloneFaculty = (data: Faculty[]): Faculty[] => JSON.parse(JSON.stringify(data));

const sortByTotal = <T extends { totals: { overall: number } }>(items: T[]): T[] =>
  [...items].sort((a, b) => b.totals.overall - a.totals.overall);

const sortByWeek = <T extends { totals: Record<WeekKey, number> }>(
  items: T[],
  weekKey: WeekKey
): T[] => [...items].sort((a, b) => b.totals[weekKey] - a.totals[weekKey]);

const applySearchAndFilters = (
  students: Student[],
  search: string,
  divisionFilter: DivisionFilter,
  boardingFilter: BoardingFilter
): Student[] => {
  const s = search.trim().toLowerCase();
  return students.filter((st) => {
    if (divisionFilter !== "ALL" && st.division !== divisionFilter) return false;
    if (boardingFilter === "BOARDER" && !st.isBoarder) return false;
    if (boardingFilter === "DAY" && st.isBoarder) return false;
    if (!s) return true;
    return st.name.toLowerCase().includes(s);
  });
};

const filteredFacultyBySearch = (faculty: Faculty[], search: string): Faculty[] => {
  const s = search.trim().toLowerCase();
  if (!s) return faculty;
  return faculty.filter((f) => f.name.toLowerCase().includes(s));
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [adminLog, setAdminLog] = useState<AdminLogEntry[]>([]);

  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState<DivisionFilter>("ALL");
  const [boardingFilter, setBoardingFilter] = useState<BoardingFilter>("ALL");
  const [weeklyTab, setWeeklyTab] = useState<WeekKey>("week1");
  const [selectedUSAdvisory, setSelectedUSAdvisory] = useState<string>("ALL");
  const [selectedMSAdvisory, setSelectedMSAdvisory] = useState<string>("ALL");
  const [sacLogoError, setSacLogoError] = useState(false);
  const [jumpstartLogoError, setJumpstartLogoError] = useState(false);

  // Initial load from localStorage or seed
  useEffect(() => {
    try {
      const storedStudents = window.localStorage.getItem(LS_KEY_STUDENTS);
      const storedFaculty = window.localStorage.getItem(LS_KEY_FACULTY);
      const storedLog = window.localStorage.getItem(LS_KEY_LOG);

      if (storedStudents && storedFaculty) {
        setStudents(JSON.parse(storedStudents));
        setFaculty(JSON.parse(storedFaculty));
      } else {
        setStudents(cloneStudents(seedStudents));
        setFaculty(cloneFaculty(seedFaculty));
      }

      if (storedLog) {
        setAdminLog(JSON.parse(storedLog));
      }
    } catch {
      setStudents(cloneStudents(seedStudents));
      setFaculty(cloneFaculty(seedFaculty));
      setAdminLog([]);
    }
  }, []);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    if (!students.length || !faculty.length) return;
    window.localStorage.setItem(LS_KEY_STUDENTS, JSON.stringify(students));
    window.localStorage.setItem(LS_KEY_FACULTY, JSON.stringify(faculty));
    window.localStorage.setItem(LS_KEY_LOG, JSON.stringify(adminLog));
  }, [students, faculty, adminLog]);

  const visibleStudents = useMemo(
    () => applySearchAndFilters(students, search, divisionFilter, boardingFilter),
    [students, search, divisionFilter, boardingFilter]
  );

  const visibleFaculty = useMemo(
    () => filteredFacultyBySearch(faculty, search),
    [faculty, search]
  );

  const overallRanking = useMemo(
    () => sortByTotal(visibleStudents),
    [visibleStudents]
  );
  const top3Overall = overallRanking.slice(0, 3);
  const top20Overall = overallRanking.slice(0, 20);

  const weeklyRanking = useMemo(
    () => sortByWeek(visibleStudents, weeklyTab),
    [visibleStudents, weeklyTab]
  );

  const boarderRanking = useMemo(
    () => sortByTotal(visibleStudents.filter((s) => s.isBoarder)),
    [visibleStudents]
  );
  const dayRanking = useMemo(
    () => sortByTotal(visibleStudents.filter((s) => !s.isBoarder)),
    [visibleStudents]
  );

  const usAdvisories = useMemo(
    () =>
      Array.from(
        new Set(students.filter((s) => s.division === "US").map((s) => s.advisoryGroup))
      ).sort(),
    [students]
  );
  const msAdvisories = useMemo(
    () =>
      Array.from(
        new Set(students.filter((s) => s.division === "MS").map((s) => s.advisoryGroup))
      ).sort(),
    [students]
  );

  const usAdvisoryRanking = useMemo(() => {
    const pool = visibleStudents.filter((s) => s.division === "US");
    const filtered =
      selectedUSAdvisory === "ALL"
        ? pool
        : pool.filter((s) => s.advisoryGroup === selectedUSAdvisory);
    return sortByTotal(filtered);
  }, [visibleStudents, selectedUSAdvisory]);

  const msAdvisoryRanking = useMemo(() => {
    const pool = visibleStudents.filter((s) => s.division === "MS");
    const filtered =
      selectedMSAdvisory === "ALL"
        ? pool
        : pool.filter((s) => s.advisoryGroup === selectedMSAdvisory);
    return sortByTotal(filtered);
  }, [visibleStudents, selectedMSAdvisory]);

  const FUNDRAISING_GOAL = 150000;
  const totalDonations = useMemo(
    () =>
      students.reduce((sum, st) => sum + st.totals.overall, 0) +
      faculty.reduce((sum, f) => sum + f.totals.overall, 0),
    [students, faculty]
  );
  const donationProgress = Math.min(1, totalDonations / FUNDRAISING_GOAL);

  const handleApplyUpdate = (
    targetType: TargetType,
    targetId: string,
    weekKey: WeekKey,
    amount: number,
    note?: string
  ) => {
    if (targetType === "student") {
      setStudents((prev) =>
        prev.map((st) => {
          if (st.id !== targetId) return st;
          const prevTotals = { ...st.totals };
          const updatedTotals = { ...st.totals };
          if (weekKey === "overall") {
            updatedTotals.overall += amount;
          } else {
            updatedTotals[weekKey] += amount;
            updatedTotals.overall += amount;
          }

          const entry: AdminLogEntry = {
            id: `LOG-${Date.now()}`,
            timestamp: Date.now(),
            targetType,
            targetId,
            weekKey,
            amount,
            note,
            previousTotals: prevTotals
          };
          setAdminLog((prevLog) => [...prevLog, entry]);
          return { ...st, totals: updatedTotals };
        })
      );
    } else {
      setFaculty((prev) =>
        prev.map((f) => {
          if (f.id !== targetId) return f;
          const prevTotals = { ...f.totals };
          const updatedTotals = { ...f.totals };
          if (weekKey === "overall") {
            updatedTotals.overall += amount;
          } else {
            updatedTotals[weekKey] += amount;
            updatedTotals.overall += amount;
          }

          const entry: AdminLogEntry = {
            id: `LOG-${Date.now()}`,
            timestamp: Date.now(),
            targetType,
            targetId,
            weekKey,
            amount,
            note,
            previousTotals: prevTotals
          };
          setAdminLog((prevLog) => [...prevLog, entry]);
          return { ...f, totals: updatedTotals };
        })
      );
    }
  };

  const handleUndoLast = () => {
    const last = adminLog[adminLog.length - 1];
    if (!last) return;

    if (last.targetType === "student") {
      setStudents((prev) =>
        prev.map((st) =>
          st.id === last.targetId ? { ...st, totals: { ...last.previousTotals } } : st
        )
      );
    } else {
      setFaculty((prev) =>
        prev.map((f) =>
          f.id === last.targetId ? { ...f, totals: { ...last.previousTotals } } : f
        )
      );
    }

    setAdminLog((prev) => prev.slice(0, -1));
  };

  const handleResetAll = () => {
    setStudents(cloneStudents(seedStudents));
    setFaculty(cloneFaculty(seedFaculty));
    setAdminLog([]);
  };

  const handleImportRoster = (newStudents: Student[], newFaculty: Faculty[]) => {
    setStudents(newStudents);
    setFaculty(newFaculty);
    setAdminLog([]);
  };

  return (
    <div className="min-h-screen relative overflow-hidden jungle-layer jungle-vines">
      {/* Decorative SVG foliage/animals over the jungle scene, kept subtle for readability */}
      <JungleBackground />
      {/* Overlay keeps jungle scene at ~50% visibility so content stays clear */}
      <div className="absolute inset-0 z-[1] bg-jungle-950/40 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
        <header className="flex flex-col gap-4 sm:gap-5 md:gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-full bg-jungle-800/90 border-2 border-jungle-400/40 flex items-center justify-center overflow-hidden shrink-0 shadow-bubble-sm">
                {!sacLogoError ? (
                  <img
                    src="/assets/sac-logo.png"
                    alt="St. Andrew's College"
                    className="h-full w-full object-contain object-center"
                    onError={() => setSacLogoError(true)}
                  />
                ) : (
                  <span className="font-bubble text-xs sm:text-sm text-jungle-400 text-center leading-tight">
                    SAC
                    <br />
                    Crest
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[0.65rem] font-body uppercase tracking-[0.26em] text-stone-200/90">
                  St. Andrew&apos;s College
                </span>
                <span className="text-[0.65rem] font-body uppercase tracking-[0.26em] text-stone-200/90">
                  ×
                </span>
                <span className="text-[0.65rem] font-body uppercase tracking-[0.26em] text-stone-200/90">
                  Jumpstart
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                window.open(
                  "https://donate.jmpst.ca/standrewscollegespringsmash2026",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="font-bubble inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-jungle-orange-light via-jungle-orange to-jungle-orange-dark px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-bubble-text border-2 border-amber-600/60 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <span>Donate Now</span>
              <span className="text-base sm:text-lg">♥</span>
            </button>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-[0.65rem] font-body uppercase tracking-[0.26em] text-stone-200/90">
                  Jumpstart
                </p>
                <p className="text-[0.65rem] font-body uppercase tracking-[0.26em] text-stone-200/90">
                  Sport Relief
                </p>
              </div>
              <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-full bg-jungle-800/90 border-2 border-jungle-400/40 flex items-center justify-center overflow-hidden shrink-0 shadow-bubble-sm">
                {!jumpstartLogoError ? (
                  <img
                    src="/assets/jumpstart-logo.png"
                    alt="Jumpstart"
                    className="h-full w-full object-contain object-center"
                    onError={() => setJumpstartLogoError(true)}
                  />
                ) : (
                  <span className="font-bubble text-[0.6rem] sm:text-xs text-jungle-400 text-center leading-tight">
                    Jumpstart
                    <br />
                    Logo
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-center space-y-1 sm:space-y-2">
            <h1 className="title-bubble font-bubble text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] leading-tight">
              Jungle SpringSmash 2026 — Donation Leaderboard
            </h1>
            <p className="font-body text-sm sm:text-base md:text-lg text-stone-200/95 max-w-2xl mx-auto font-semibold">
              St. Andrew&apos;s College × Jumpstart —{" "}
              <span className="text-white">Helping more kids access sport</span> through
              community-powered giving.
            </p>
          </div>

          <div className="rounded-[2rem] border border-jungle-400/40 bg-jungle-900/85 p-5 shadow-soft-card overflow-hidden">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.26em] text-amber-200/80 font-semibold">
                  Total SAC Donations
                </p>
                <h2 className="text-2xl sm:text-3xl font-bubble text-white">
                  SpringSmash Goal Progress
                </h2>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.22em] text-stone-300">
                  Fundraising target
                </p>
                <p className="font-semibold text-sm sm:text-base text-stone-100">
                  $150,000 goal
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_auto] lg:items-end">
              <div className="rounded-[2rem] border border-jungle-400/30 bg-jungle-950/80 p-5 shadow-soft-card">
                <div className="relative mx-auto h-[320px] w-full max-w-[260px]">
                  <div className="absolute inset-x-0 top-0 flex justify-center">
                    <div className="relative h-32 w-32">
                      <div className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 rounded-full bg-emerald-500/95 shadow-[0_0_0_10px_rgba(52,211,153,0.16)]" />
                      <div className="absolute left-1/2 top-4 h-24 w-24 -translate-x-1/2 rounded-full bg-emerald-600/95" />
                      <div className="absolute left-1/2 top-8 h-20 w-20 -translate-x-1/2 rounded-full bg-emerald-400/90" />
                      <div className="absolute left-1/2 top-12 h-16 w-16 -translate-x-1/2 rounded-full bg-emerald-500/95" />
                      <div className="absolute left-1/2 top-16 h-18 w-18 -translate-x-1/2 rounded-full bg-emerald-500/90" />
                    </div>
                  </div>

                  <div className="absolute left-1/2 top-[120px] -translate-x-1/2 w-24">
                    <div className="relative h-[180px] w-full overflow-hidden rounded-[1rem] border-4 border-stone-700 bg-stone-900/90">
                      <div
                        className="absolute inset-x-0 bottom-0 bg-emerald-400/90 transition-all duration-500"
                        style={{ height: `${donationProgress * 100}%` }}
                      />
                    </div>
                    <div className="absolute left-1/2 top-0 h-8 w-8 -translate-x-1/2 rounded-full border-4 border-stone-700 bg-stone-900" />
                  </div>

                  <div className="absolute left-1/2 top-[260px] -translate-x-1/2 h-3 w-20 rounded-full bg-emerald-500/90 shadow-inner" />
                  <div className="absolute left-1/2 top-[286px] -translate-x-1/2 h-4 w-24 rounded-full bg-amber-600/90" />
                </div>
                <p className="mt-4 text-center text-sm text-stone-300">
                  Your fundraiser tree trunk is the thermometer: the green fill rises as donations grow toward the goal.
                </p>
              </div>
              <div className="rounded-3xl border border-emerald-300/20 bg-jungle-900/75 p-4 text-sm text-stone-200">
                <p className="text-xs uppercase tracking-[0.22em] text-amber-200/80">Goal status</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {donationProgress >= 1
                    ? "Goal reached!"
                    : `${Math.round(donationProgress * 100)}% toward $150,000`}
                </p>
                <p className="mt-1 text-stone-300">The tree graphic now shows the donation threshold visually in the trunk.</p>
              </div>
            </div>
          </div>

          <SearchFilters
            search={search}
            onSearchChange={setSearch}
            divisionFilter={divisionFilter}
            onDivisionChange={setDivisionFilter}
            boardingFilter={boardingFilter}
            onBoardingChange={setBoardingFilter}
          />
        </header>

        <main className="space-y-4 sm:space-y-5 md:space-y-6">
          <SectionCard
            title="Top 3 Overall Donors"
            subtitle="Leaderboard leaders across all grades — auto-updated as donations are added."
            defaultOpen
          >
            <div className="space-y-2.5 sm:space-y-3">
              {top3Overall.map((st, idx) => (
                <ProfileRow
                  key={st.id}
                  rank={idx + 1}
                  name={st.name}
                  grade={st.grade}
                  houseOrClan={st.houseOrClan}
                  divisionLabel={st.division}
                  isBoarder={st.isBoarder}
                  total={st.totals.overall}
                />
              ))}
              {top3Overall.length === 0 ? (
                <p className="text-xs sm:text-sm text-stone-200/85 font-body">
                  No data yet — add your first donations in the admin panel to see the leaderboard
                  come to life.
                </p>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard
            title="Top 20 Overall Donors"
            subtitle="Deep dive into the full leaderboard across the event."
            defaultOpen={false}
          >
            <div className="space-y-2.5 sm:space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {top20Overall.map((st, idx) => (
                <ProfileRow
                  key={st.id}
                  rank={idx + 1}
                  name={st.name}
                  grade={st.grade}
                  houseOrClan={st.houseOrClan}
                  divisionLabel={st.division}
                  isBoarder={st.isBoarder}
                  total={st.totals.overall}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Weekly Top Donors"
            subtitle="Celebrating Weekly SpringSmash momentum."
            defaultOpen
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              {(["week1", "week2", "week3", "week4"] as WeekKey[]).map((wKey) => (
                <button
                  key={wKey}
                  type="button"
                  onClick={() => setWeeklyTab(wKey)}
                  className={`font-bubble inline-flex items-center rounded-full border-2 px-3 py-1.5 text-xs sm:text-sm font-semibold tracking-wide transition-colors ${
                    weeklyTab === wKey
                      ? "bg-jungle-orange text-white border-amber-600 shadow-bubble-sm"
                      : "bg-jungle-800/80 border-jungle-500/50 text-stone-200 hover:bg-jungle-700/80"
                  }`}
                >
                  {wKey === "week1"
                    ? "Week 1"
                    : wKey === "week2"
                    ? "Week 2"
                    : wKey === "week3"
                    ? "Week 3"
                    : "Week 4"}
                </button>
              ))}
            </div>
            <div className="space-y-2.5 sm:space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {weeklyRanking.slice(0, 10).map((st, idx) => (
                <ProfileRow
                  key={`${st.id}-${weeklyTab}`}
                  rank={idx + 1}
                  name={st.name}
                  grade={st.grade}
                  houseOrClan={st.houseOrClan}
                  divisionLabel={st.division}
                  isBoarder={st.isBoarder}
                  total={st.totals[weeklyTab]}
                />
              ))}
              {weeklyRanking.length === 0 ? (
                <p className="text-xs sm:text-sm text-stone-200/85 font-body">
                  No donors have been recorded for this week yet.
                </p>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard
            title="Top Boarder Donors"
            subtitle="Boarding students rallying from across campus."
            defaultOpen={false}
          >
            <div className="space-y-2.5 sm:space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {boarderRanking.slice(0, 10).map((st, idx) => (
                <ProfileRow
                  key={st.id}
                  rank={idx + 1}
                  name={st.name}
                  grade={st.grade}
                  houseOrClan={st.houseOrClan}
                  divisionLabel={st.division}
                  isBoarder={st.isBoarder}
                  total={st.totals.overall}
                />
              ))}
              {boarderRanking.length === 0 ? (
                <p className="text-xs sm:text-sm text-stone-200/85 font-body">
                  No boarder donations recorded yet.
                </p>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard
            title="Top Day Boy Donors"
            subtitle="Day students powering SpringSmash from home."
            defaultOpen={false}
          >
            <div className="space-y-2.5 sm:space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {dayRanking.slice(0, 10).map((st, idx) => (
                <ProfileRow
                  key={st.id}
                  rank={idx + 1}
                  name={st.name}
                  grade={st.grade}
                  houseOrClan={st.houseOrClan}
                  divisionLabel={st.division}
                  isBoarder={st.isBoarder}
                  total={st.totals.overall}
                />
              ))}
              {dayRanking.length === 0 ? (
                <p className="text-xs sm:text-sm text-stone-200/85 font-body">
                  No day boy donations recorded yet.
                </p>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard
            title="Top US Advisory Donors"
            subtitle="Upper School advisories climbing the canopy together."
            defaultOpen={false}
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
              <select
                value={selectedUSAdvisory}
                onChange={(e) => setSelectedUSAdvisory(e.target.value)}
                className="rounded-2xl bg-jungle-800/80 border-2 border-jungle-500/50 px-3 py-2 text-xs sm:text-sm text-stone-100 font-body focus:outline-none focus:ring-2 focus:ring-jungle-orange/60"
              >
                <option value="ALL">All US Advisories</option>
                {usAdvisories.map((adv) => (
                  <option key={adv} value={adv}>
                    {adv}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2.5 sm:space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {usAdvisoryRanking.map((st, idx) => (
                <ProfileRow
                  key={st.id}
                  rank={idx + 1}
                  name={st.name}
                  grade={st.grade}
                  houseOrClan={st.houseOrClan}
                  divisionLabel={st.division}
                  isBoarder={st.isBoarder}
                  total={st.totals.overall}
                />
              ))}
              {usAdvisoryRanking.length === 0 ? (
                <p className="text-xs sm:text-sm text-stone-200/85 font-body">
                  No Upper School advisory donations recorded yet.
                </p>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard
            title="Top MS Advisory Donors"
            subtitle="Middle School advisories building the jungle roots."
            defaultOpen={false}
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
              <select
                value={selectedMSAdvisory}
                onChange={(e) => setSelectedMSAdvisory(e.target.value)}
                className="rounded-2xl bg-jungle-800/80 border-2 border-jungle-500/50 px-3 py-2 text-xs sm:text-sm text-stone-100 font-body focus:outline-none focus:ring-2 focus:ring-jungle-orange/60"
              >
                <option value="ALL">All MS Advisories</option>
                {msAdvisories.map((adv) => (
                  <option key={adv} value={adv}>
                    {adv}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2.5 sm:space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {msAdvisoryRanking.map((st, idx) => (
                <ProfileRow
                  key={st.id}
                  rank={idx + 1}
                  name={st.name}
                  grade={st.grade}
                  houseOrClan={st.houseOrClan}
                  divisionLabel={st.division}
                  isBoarder={st.isBoarder}
                  total={st.totals.overall}
                />
              ))}
              {msAdvisoryRanking.length === 0 ? (
                <p className="text-xs sm:text-sm text-stone-200/85 font-body">
                  No Middle School advisory donations recorded yet.
                </p>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard
            title="Top Faculty Donors"
            subtitle="Faculty and staff leading by example."
            defaultOpen={false}
          >
            <div className="space-y-2.5 sm:space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {sortByTotal(visibleFaculty).map((f, idx) => (
                <ProfileRow
                  key={f.id}
                  rank={idx + 1}
                  name={f.name}
                  total={f.totals.overall}
                  isFaculty
                />
              ))}
            </div>
          </SectionCard>

          <AdminPanel
            students={students}
            faculty={faculty}
            onApplyUpdate={handleApplyUpdate}
            onUndoLast={handleUndoLast}
            onResetAll={handleResetAll}
            onImportRoster={handleImportRoster}
            lastEntry={adminLog[adminLog.length - 1]}
          />
        </main>

        <footer className="pt-2 pb-3 text-center text-[0.65rem] sm:text-xs text-stone-300/70 font-body">
          Jungle SpringSmash 2026 — Prototype leaderboard UI. Data shown here is sample-only and
          updated manually by event admins.
        </footer>
      </div>
    </div>
  );
};

export default App;

