import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./lib/supabaseClient";
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
import TreeThermometer from "./components/TreeThermometer";
import PrizeBanner from "./components/PrizeBanner";

const cloneStudents = (data: Student[]): Student[] => JSON.parse(JSON.stringify(data));
const cloneFaculty = (data: Faculty[]): Faculty[] => JSON.parse(JSON.stringify(data));

type StudentRow = {
  id: string;
  name: string;
  grade: number;
  division: string;
  house_or_clan: string;
  is_boarder: boolean;
  advisory_group: string;
  overall: number;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
};

type FacultyRow = {
  id: string;
  name: string;
  overall: number;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
};

const rowToStudent = (row: StudentRow): Student => ({
  id: row.id,
  name: row.name,
  grade: row.grade,
  division: row.division as "US" | "MS",
  houseOrClan: row.house_or_clan,
  isBoarder: row.is_boarder,
  advisoryGroup: row.advisory_group,
  totals: {
    overall: row.overall,
    week1: row.week1,
    week2: row.week2,
    week3: row.week3,
    week4: row.week4
  }
});

const studentToRow = (student: Student): StudentRow => ({
  id: student.id,
  name: student.name,
  grade: student.grade,
  division: student.division,
  house_or_clan: student.houseOrClan,
  is_boarder: student.isBoarder,
  advisory_group: student.advisoryGroup,
  overall: student.totals.overall,
  week1: student.totals.week1,
  week2: student.totals.week2,
  week3: student.totals.week3,
  week4: student.totals.week4
});

const rowToFaculty = (row: FacultyRow): Faculty => ({
  id: row.id,
  name: row.name,
  totals: {
    overall: row.overall,
    week1: row.week1,
    week2: row.week2,
    week3: row.week3,
    week4: row.week4
  }
});

const facultyToRow = (faculty: Faculty): FacultyRow => ({
  id: faculty.id,
  name: faculty.name,
  overall: faculty.totals.overall,
  week1: faculty.totals.week1,
  week2: faculty.totals.week2,
  week3: faculty.totals.week3,
  week4: faculty.totals.week4
});

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
  const [sacLogoError, setSacLogoError] = useState(false);
  const [jumpstartLogoError, setJumpstartLogoError] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const scrollDirectionRef = useRef<1 | -1>(1);
  const rafRef = useRef<number | null>(null);

  const fetchSupabaseData = async () => {
    const [studentResponse, facultyResponse] = await Promise.all([
      supabase.from<StudentRow>("students").select("*") ,
      supabase.from<FacultyRow>("faculty").select("*")
    ]);

    if (studentResponse.error) {
      console.error("Supabase students error:", studentResponse.error);
    }
    if (facultyResponse.error) {
      console.error("Supabase faculty error:", facultyResponse.error);
    }

    if (studentResponse.data && studentResponse.data.length > 0) {
      setStudents(studentResponse.data.map(rowToStudent));
    } else {
      setStudents(cloneStudents(seedStudents));
    }

    if (facultyResponse.data && facultyResponse.data.length > 0) {
      setFaculty(facultyResponse.data.map(rowToFaculty));
    } else {
      setFaculty(cloneFaculty(seedFaculty));
    }
  };

  const upsertStudentRows = async (studentsToSave: Student[]) => {
    const rows = studentsToSave.map(studentToRow);
    const { error } = await supabase.from<StudentRow>("students").upsert(rows, {
      onConflict: "id"
    });
    if (error) console.error("Failed to save student rows", error);
  };

  const upsertFacultyRows = async (facultyToSave: Faculty[]) => {
    const rows = facultyToSave.map(facultyToRow);
    const { error } = await supabase.from<FacultyRow>("faculty").upsert(rows, {
      onConflict: "id"
    });
    if (error) console.error("Failed to save faculty rows", error);
  };

  useEffect(() => {
    void fetchSupabaseData();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-donations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        () => {
          void fetchSupabaseData();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "faculty" },
        () => {
          void fetchSupabaseData();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!autoScroll) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      return;
    }
    const SPEED = 1.2;
    const step = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollBy(0, SPEED * scrollDirectionRef.current);
      if (window.scrollY >= maxScroll) scrollDirectionRef.current = -1;
      else if (window.scrollY <= 0) scrollDirectionRef.current = 1;
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [autoScroll]);

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

  const usHouseStandings = useMemo(() => {
    const map = new Map<string, number>();
    students
      .filter((s) => s.division === "US" && s.houseOrClan)
      .forEach((s) => {
        map.set(s.houseOrClan, (map.get(s.houseOrClan) ?? 0) + s.totals.overall);
      });
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }, [students]);

  const msClanStandings = useMemo(() => {
    const map = new Map<string, number>();
    students
      .filter((s) => s.division === "MS" && s.houseOrClan)
      .forEach((s) => {
        map.set(s.houseOrClan, (map.get(s.houseOrClan) ?? 0) + s.totals.overall);
      });
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }, [students]);

  const usAdvisoryStandings = useMemo(() => {
    const map = new Map<string, number>();
    students
      .filter((s) => s.division === "US" && s.advisoryGroup)
      .forEach((s) => {
        map.set(s.advisoryGroup, (map.get(s.advisoryGroup) ?? 0) + s.totals.overall);
      });
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }, [students]);

  const msAdvisoryStandings = useMemo(() => {
    const map = new Map<string, number>();
    students
      .filter((s) => s.division === "MS" && s.advisoryGroup)
      .forEach((s) => {
        map.set(s.advisoryGroup, (map.get(s.advisoryGroup) ?? 0) + s.totals.overall);
      });
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);
  }, [students]);

  const FUNDRAISING_GOAL = 60000;
  const totalDonations = useMemo(
    () =>
      students.reduce((sum, st) => sum + st.totals.overall, 0) +
      faculty.reduce((sum, f) => sum + f.totals.overall, 0),
    [students, faculty]
  );
  const donationProgress = Math.min(1, totalDonations / FUNDRAISING_GOAL);

  const handleApplyUpdate = async (
    targetType: TargetType,
    targetId: string,
    weekKey: WeekKey,
    amount: number,
    note?: string
  ) => {
    if (targetType === "student") {
      const nextStudents = students.map((st) => {
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
      });

      setStudents(nextStudents);
      const updatedStudent = nextStudents.find((st) => st.id === targetId);
      if (updatedStudent) {
        await upsertStudentRows([updatedStudent]);
      }
    } else {
      const nextFaculty = faculty.map((f) => {
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
      });

      setFaculty(nextFaculty);
      const updatedFaculty = nextFaculty.find((f) => f.id === targetId);
      if (updatedFaculty) {
        await upsertFacultyRows([updatedFaculty]);
      }
    }
  };

  const handleUndoLast = async () => {
    const last = adminLog[adminLog.length - 1];
    if (!last) return;

    if (last.targetType === "student") {
      const nextStudents = students.map((st) =>
        st.id === last.targetId ? { ...st, totals: { ...last.previousTotals } } : st
      );
      setStudents(nextStudents);
      const restoredStudent = nextStudents.find((st) => st.id === last.targetId);
      if (restoredStudent) {
        await upsertStudentRows([restoredStudent]);
      }
    } else {
      const nextFaculty = faculty.map((f) =>
        f.id === last.targetId ? { ...f, totals: { ...last.previousTotals } } : f
      );
      setFaculty(nextFaculty);
      const restoredFaculty = nextFaculty.find((f) => f.id === last.targetId);
      if (restoredFaculty) {
        await upsertFacultyRows([restoredFaculty]);
      }
    }

    setAdminLog((prev) => prev.slice(0, -1));
  };

  const handleResetAll = async () => {
    const resetStudents = cloneStudents(seedStudents);
    const resetFaculty = cloneFaculty(seedFaculty);
    setStudents(resetStudents);
    setFaculty(resetFaculty);
    setAdminLog([]);
    await Promise.all([upsertStudentRows(resetStudents), upsertFacultyRows(resetFaculty)]);
  };

  const handleImportRoster = async (newStudents: Student[], newFaculty: Faculty[]) => {
    setStudents(newStudents);
    setFaculty(newFaculty);
    setAdminLog([]);
    await Promise.all([upsertStudentRows(newStudents), upsertFacultyRows(newFaculty)]);
  };

  return (
    <div className="min-h-screen relative overflow-hidden jungle-layer jungle-vines">
      {/* Decorative SVG foliage/animals over the jungle scene, kept subtle for readability */}
      <JungleBackground />
      {/* Overlay keeps jungle scene at ~50% visibility so content stays clear */}
      <div className="absolute inset-0 z-[1] bg-jungle-950/40 pointer-events-none" />

      <button
        type="button"
        onClick={() => setAutoScroll((v) => !v)}
        className={`fixed bottom-5 right-5 z-50 font-bubble rounded-2xl border-2 px-4 py-2.5 text-sm font-bold shadow-bubble-sm transition-colors ${
          autoScroll
            ? "bg-jungle-orange border-amber-600/80 text-white"
            : "bg-jungle-900/90 border-jungle-400/50 text-stone-200 hover:bg-jungle-800"
        }`}
      >
        {autoScroll ? "⏸ Stop Scroll" : "▶ Auto Scroll"}
      </button>

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
            <p
              className="font-body text-3xl text-emerald-200 max-w-2xl mx-auto font-semibold italic"
              style={{
                textShadow: '2px 2px 0px rgba(0,0,0,0.7), 4px 4px 0px rgba(0,0,0,0.5), 6px 6px 0px rgba(0,0,0,0.3)'
              }}
            >
              EVERYONE PLAYS IN THE JUNGLE!
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
                  $60,000 goal
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col items-center gap-4">
              <div className="mx-auto flex w-full max-w-[360px] items-stretch">
                <div className="relative h-[340px] w-[260px] shrink-0">
                  <TreeThermometer progress={donationProgress} />
                </div>
                <div className="flex h-[340px] w-28 flex-col justify-between text-xs font-medium text-stone-300">
                  {["$60,000","$54,000","$48,000","$42,000","$36,000","$30,000","$24,000","$18,000","$12,000","$6,000"].map((label) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="flex-1 border-t border-stone-400/60" />
                      <span className="whitespace-nowrap">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full rounded-3xl border border-emerald-300/20 bg-jungle-900/75 px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-amber-200/80">Goal status</p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {donationProgress >= 1
                      ? "Goal reached!"
                      : `${Math.round(donationProgress * 100)}% toward $60,000`}
                  </p>
                </div>
                <p
                  className="text-4xl font-bold text-emerald-200 drop-shadow-xl"
                  style={{
                    textShadow: '2px 2px 0px rgba(0,0,0,0.7), 4px 4px 0px rgba(0,0,0,0.5), 6px 6px 0px rgba(0,0,0,0.3)'
                  }}
                >
                  ${totalDonations.toLocaleString()}
                </p>
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
            <PrizeBanner prizes={[
              { rank: "1st", prize: "Meta VR Headset", icon: "🥽", gold: true },
              { rank: "2nd", prize: "AirPods 3", icon: "🎧" },
              { rank: "3rd", prize: "JBL Flip Essential 2", icon: "🔊" },
            ]} />
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
            title="Top 20 Overall Donors - Event VIP Status!"
            subtitle="Deep dive into the full leaderboard across the event."
            defaultOpen={false}
          >
            <PrizeBanner prizes={[
              { rank: "Top 20", prize: "VIP Room & Fast Pass", icon: "🎟️", gold: true },
            ]} />
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
              {(["week1", "week2"] as WeekKey[]).map((wKey) => (
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
                  {wKey === "week1" ? "Week 1" : "Week 2"}
                </button>
              ))}
            </div>
            <PrizeBanner prizes={[
              { rank: "1st", prize: "Pie a Teacher!", icon: "🥧", gold: true },
              { rank: "2nd", prize: "Pie a Teacher!", icon: "👨‍🏫" },
            ]} />
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
            title="US House Standings"
            subtitle="Upper School houses competing for the top spot — combined donations from all members."
            defaultOpen
          >
            <div className="space-y-2.5 sm:space-y-3">
              {usHouseStandings.map((house, idx) => {
                const rankStyle =
                  idx === 0
                    ? "text-amber-400 border-amber-400/50 bg-amber-400/10"
                    : idx === 1
                    ? "text-slate-300 border-slate-300/50 bg-slate-300/10"
                    : idx === 2
                    ? "text-amber-600 border-amber-600/50 bg-amber-600/10"
                    : "text-stone-400 border-stone-500/30 bg-stone-500/10";
                return (
                  <div
                    key={house.name}
                    className="flex items-center gap-3 rounded-2xl border border-jungle-500/25 bg-jungle-800/70 px-4 py-3 shadow-bubble-sm"
                  >
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bubble text-sm shrink-0 ${rankStyle}`}
                    >
                      {idx + 1}
                    </div>
                    <span className="flex-1 font-bubble text-sm sm:text-base text-white">
                      {house.name}
                    </span>
                  </div>
                );
              })}
              {usHouseStandings.length === 0 ? (
                <p className="text-xs sm:text-sm text-stone-200/85 font-body">
                  No Upper School house donations recorded yet.
                </p>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard
            title="MS Clan Standings"
            subtitle="Middle School clans battling it out for clan glory — combined donations from all members."
            defaultOpen
          >
            <div className="space-y-2.5 sm:space-y-3">
              {msClanStandings.map((clan, idx) => {
                const rankStyle =
                  idx === 0
                    ? "text-amber-400 border-amber-400/50 bg-amber-400/10"
                    : idx === 1
                    ? "text-slate-300 border-slate-300/50 bg-slate-300/10"
                    : idx === 2
                    ? "text-amber-600 border-amber-600/50 bg-amber-600/10"
                    : "text-stone-400 border-stone-500/30 bg-stone-500/10";
                return (
                  <div
                    key={clan.name}
                    className="flex items-center gap-3 rounded-2xl border border-jungle-500/25 bg-jungle-800/70 px-4 py-3 shadow-bubble-sm"
                  >
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bubble text-sm shrink-0 ${rankStyle}`}
                    >
                      {idx + 1}
                    </div>
                    <span className="flex-1 font-bubble text-sm sm:text-base text-white">
                      {clan.name}
                    </span>
                  </div>
                );
              })}
              {msClanStandings.length === 0 ? (
                <p className="text-xs sm:text-sm text-stone-200/85 font-body">
                  No Middle School clan donations recorded yet.
                </p>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard
            title="Top US Advisory Standings"
            subtitle="Upper School advisories ranked by combined member donations."
            defaultOpen
          >
            <PrizeBanner prizes={[
              { rank: "1st", prize: "Osmow's Platter", icon: "🥙", gold: true },
            ]} />
            <div className="space-y-2.5 sm:space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {usAdvisoryStandings.map((adv, idx) => {
                const rankStyle =
                  idx === 0
                    ? "text-amber-400 border-amber-400/50 bg-amber-400/10"
                    : idx === 1
                    ? "text-slate-300 border-slate-300/50 bg-slate-300/10"
                    : idx === 2
                    ? "text-amber-600 border-amber-600/50 bg-amber-600/10"
                    : "text-stone-400 border-stone-500/30 bg-stone-500/10";
                return (
                  <div
                    key={adv.name}
                    className="flex items-center gap-3 rounded-2xl border border-jungle-500/25 bg-jungle-800/70 px-4 py-3 shadow-bubble-sm"
                  >
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bubble text-sm shrink-0 ${rankStyle}`}
                    >
                      {idx + 1}
                    </div>
                    <span className="flex-1 font-bubble text-sm sm:text-base text-white">
                      {adv.name}
                    </span>
                  </div>
                );
              })}
              {usAdvisoryStandings.length === 0 ? (
                <p className="text-xs sm:text-sm text-stone-200/85 font-body">
                  No Upper School advisory donations recorded yet.
                </p>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard
            title="Top MS Advisory Standings"
            subtitle="Middle School advisories ranked by combined member donations."
            defaultOpen
          >
            <PrizeBanner prizes={[
              { rank: "1st", prize: "Pizzaville Party Size", icon: "🍕", gold: true },
            ]} />
            <div className="space-y-2.5 sm:space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {msAdvisoryStandings.map((adv, idx) => {
                const rankStyle =
                  idx === 0
                    ? "text-amber-400 border-amber-400/50 bg-amber-400/10"
                    : idx === 1
                    ? "text-slate-300 border-slate-300/50 bg-slate-300/10"
                    : idx === 2
                    ? "text-amber-600 border-amber-600/50 bg-amber-600/10"
                    : "text-stone-400 border-stone-500/30 bg-stone-500/10";
                return (
                  <div
                    key={adv.name}
                    className="flex items-center gap-3 rounded-2xl border border-jungle-500/25 bg-jungle-800/70 px-4 py-3 shadow-bubble-sm"
                  >
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bubble text-sm shrink-0 ${rankStyle}`}
                    >
                      {idx + 1}
                    </div>
                    <span className="flex-1 font-bubble text-sm sm:text-base text-white">
                      {adv.name}
                    </span>
                  </div>
                );
              })}
              {msAdvisoryStandings.length === 0 ? (
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
            <PrizeBanner prizes={[
              { rank: "1st", prize: "$75 Visa Gift Card", icon: "💳", gold: true },
              { rank: "2nd", prize: "$25 Starbucks", icon: "☕" },
              { rank: "3rd", prize: "$25 Tim Hortons", icon: "🍵" },
            ]} />
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

