// One-time script: applies Week 1 (Book2.xlsx cash) + Week 2 (CSV online + Book2 cash) donations
// Run with: node update-donations.mjs

import { createClient } from './node_modules/@supabase/supabase-js/dist/index.mjs';

const supabase = createClient(
  'https://jayzzpdqyztonnotttvi.supabase.co',
  'sb_publishable_gyfFi-Kj2010lZf6V76aaw_Wh-lhv1W'
);

async function fetchAll(table) {
  const { data, error } = await supabase.from(table).select('*');
  if (error) throw new Error(`fetchAll ${table} failed: ${JSON.stringify(error)}`);
  return data;
}

async function upsertRows(table, rows) {
  const { data, error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
  if (error) throw new Error(`upsert ${table} failed: ${JSON.stringify(error)}`);
  return data;
}

// ── Donation data ────────────────────────────────────────────────────────────
// Week 1: from Book2.xlsx rows with date < 46134 (before April 24)
const WEEK1_DONATIONS = [
  { name: 'Hayes Mantrop',         amount: 100 },
  { name: 'George Ince',           amount: 100 },
  { name: 'Kyler Chen',            amount: 100 },
  { name: 'Dean Porter',           amount: 100 },
  { name: 'Duncan Ramon',          amount: 100 },
  { name: 'Carson Medcalf',        amount: 100 },
  { name: 'Adrian Belan',          amount: 100 },
  { name: 'Nicholas Gallo',        amount: 250 },
  { name: 'William Wang',          amount: 100 },
  { name: 'Sean-Carlo Tian',       amount: 100 },
  { name: 'Joshua Passero',        amount: 100 },
  { name: 'Weston Wambolt',        amount: 500 },
  { name: 'Hugh Murray',           amount:  50 },
];

// Week 1 faculty from Book2 (none in that date range — Kristen Wong is April 25 = week 2)

// Week 2: aggregated from CSV (online donations April 24–29) + Book2 week-2 cash (dates >= 46134)
// Names with multiple CSV rows have been summed. "Hudson Ofieldkada" normalised to "Hudson Ofield-Kada".
// "Charles Battiston" entries (Memorial + Memorial House) merged.
const WEEK2_STUDENT_DONATIONS = [
  { name: 'Joshua Triassi',            amount:  100 },
  { name: 'Bob Tao',                   amount:  100 },
  { name: 'Darien Abdulla',            amount:  100 },
  { name: 'Luke Haggith',              amount:  300 },
  { name: 'Matteo Triassi',            amount:  100 },
  { name: 'Victor Waite',              amount:  100 },
  { name: 'Colby Smith',               amount:  100 },
  { name: 'Maxim Quigley',             amount:  100 },
  { name: 'Alexander Quigley',         amount:  200 },
  { name: 'Jackson Boyd',              amount:  200 },
  { name: 'Massimo Cesana',            amount:  250 },
  { name: 'Gavin Zepp',                amount:  350 },
  { name: 'Joshua Passero',            amount: 1950 },
  { name: 'Anthony Jackson',           amount:  100 },
  { name: 'Charles Battiston',         amount:  300 },
  { name: 'Nantus Baard',              amount:  100 },
  { name: 'Jackson Prokopchuk',        amount:  100 },
  { name: 'Luca Sandru',               amount:  100 },
  { name: 'Yosef Shui',                amount:  100 },  // "Yosef (Yiyou) Shui"
  { name: 'Alen Fazlic',               amount:  500 },
  { name: 'Peter Lakkotrypis',         amount:  275 },
  { name: 'Weston Wambolt',            amount:  500 },
  { name: 'Andrew Mouratidis',         amount:  100 },
  { name: 'Charles Ji',                amount:  100 },
  { name: 'Scott Martin',              amount:  700 }, // 200 CSV + 500 Book2 cash
  { name: 'Bosco Yang',                amount:   75 },
  { name: 'Ian Li',                    amount:  100 },
  { name: 'Hunter Wilson',             amount:  100 },
  { name: 'Kai MacDonald',             amount:   75 },
  { name: 'Sam Gao',                   amount:  100 },
  { name: 'Jax Whiteside',             amount:  200 },
  { name: 'Sam Whiteside',             amount:  100 },
  { name: 'Eddie Duicu',               amount:   50 },
  { name: 'Darius Abdulla',            amount:  100 },
  { name: 'Frederik Koopmann',         amount:  100 },
  { name: 'Entong Miao',               amount:  250 },  // "Entong (Ethan) Miao"
  { name: 'Wilshere Tung',             amount:  285 },
  { name: 'Ari Zareian',               amount:  100 },
  { name: 'Parker Bifolchi',           amount:  100 },
  { name: 'Philip Malkhassian',        amount:  100 },
  { name: 'Eason Zhang',               amount:  100 },
  { name: 'Hudson Ofield-Kada',        amount:  700 }, // "Ofieldkada" normalised
  { name: 'Mikhail Damji',             amount:  500 },
  { name: 'Kieran Charter',            amount:  100 },
  { name: 'Gabriel Covello',           amount:   50 },
  { name: 'Reid Berwick',              amount:  100 },
  { name: 'Nate Berwick',              amount:  100 },
  { name: 'Jayden Leung',              amount:  100 },
  { name: 'Terrance Yu',               amount:  100 },
  { name: 'Domenico Crupi',            amount:  100 },
  { name: 'Gabriel Santocono',         amount:  250 },
  { name: 'Finn Crix',                 amount:  100 },
  { name: 'Riley Weedon',              amount:   25 },
  { name: 'Michael Murphy',            amount:  100 },
  { name: 'Brody Berwick',             amount:  250 },
  { name: 'Lucas He',                  amount:  200 },
  { name: 'Ethan Schembri',            amount:  100 },
  { name: 'Cruz Necovski',             amount:  400 },
  { name: 'Yue Jasper Yu',             amount: 2000 },
  { name: 'Roman Di Girolamo',         amount:  100 },
  { name: 'Logan Viau',                amount:  200 },
  { name: 'Dante Mizzi',               amount:  150 },
  { name: 'Carson Vogel',              amount:  300 },
  { name: 'Hayden Stroud',             amount:  100 },
  { name: 'Nicholas Chan',             amount:  100 },
  { name: 'Patrick Campagna',          amount:  100 },
  { name: 'Larson Froats',             amount:   50 },
  { name: 'Adam Butt',                 amount:   50 },
  { name: 'Jack Young',                amount:  100 },
  // Book2 week-2 cash additions (not in CSV)
  { name: 'Alston Wang',               amount:  500 },
  { name: 'Carter Gilroy',             amount:   60 },
  { name: 'Tristan Dunlap Sanabria',   amount: 1000 },
];

const WEEK2_FACULTY_DONATIONS = [
  { name: 'Jessica Auger',  amount: 100 },
  { name: 'Sean Ludwig',    amount: 100 },
  { name: 'Kristen Wong',   amount: 100 }, // Book2 cash April 25
];

// ── Name normalisation ───────────────────────────────────────────────────────
function stripName(name) {
  return name
    .replace(/\(.*?\)/g, '')   // remove parenthetical nicknames
    .replace(/[^a-zA-Z]/g, '') // remove all non-alpha
    .toLowerCase();
}

function buildLookup(rows, nameField) {
  const map = new Map();
  for (const row of rows) {
    const key = stripName(row[nameField]);
    if (map.has(key)) {
      console.warn(`  Duplicate normalised key "${key}" for "${row[nameField]}"`);
    }
    map.set(key, row);
  }
  return map;
}

function findRow(map, donorName) {
  const key = stripName(donorName);
  if (map.has(key)) return map.get(key);

  // Fallback: first-word + last-word match
  const parts = donorName.trim().split(/\s+/);
  if (parts.length >= 2) {
    const shortKey = stripName(parts[0] + parts[parts.length - 1]);
    for (const [k, v] of map) {
      const kParts = k; // already stripped
      if (kParts.startsWith(stripName(parts[0])) && kParts.endsWith(stripName(parts[parts.length - 1]))) {
        return v;
      }
    }
  }
  return null;
}

// ── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log('Fetching current data from Supabase…');
  const students = await fetchAll('students');
  const faculty  = await fetchAll('faculty');
  console.log(`  ${students.length} students, ${faculty.length} faculty found`);

  const studentMap = buildLookup(students, 'name');
  const facultyMap = buildLookup(faculty,  'name');

  const updatedStudents = new Map(); // id → row
  const updatedFaculty  = new Map();

  const unmatched = [];

  function applyStudent(donorName, weekField, amount) {
    const row = findRow(studentMap, donorName);
    if (!row) { unmatched.push({ donorName, weekField, amount, type: 'student' }); return; }
    const cur = updatedStudents.get(row.id) ?? { ...row };
    cur[weekField] = (cur[weekField] ?? 0) + amount;
    cur.overall    = (cur.overall    ?? 0) + amount;
    updatedStudents.set(row.id, cur);
  }

  function applyFaculty(donorName, weekField, amount) {
    const row = findRow(facultyMap, donorName);
    if (!row) { unmatched.push({ donorName, weekField, amount, type: 'faculty' }); return; }
    const cur = updatedFaculty.get(row.id) ?? { ...row };
    cur[weekField] = (cur[weekField] ?? 0) + amount;
    cur.overall    = (cur.overall    ?? 0) + amount;
    updatedFaculty.set(row.id, cur);
  }

  console.log('\nApplying Week 1 donations…');
  for (const { name, amount } of WEEK1_DONATIONS) applyStudent(name, 'week1', amount);

  console.log('Applying Week 2 student donations…');
  for (const { name, amount } of WEEK2_STUDENT_DONATIONS) applyStudent(name, 'week2', amount);

  console.log('Applying Week 2 faculty donations…');
  for (const { name, amount } of WEEK2_FACULTY_DONATIONS) applyFaculty(name, 'week2', amount);

  if (unmatched.length) {
    console.warn('\n⚠ Unmatched donors (not found in Supabase roster):');
    for (const u of unmatched) console.warn(`  [${u.type}] "${u.donorName}" — $${u.amount} → ${u.weekField}`);
  } else {
    console.log('\nAll donors matched successfully.');
  }

  const studentRows = [...updatedStudents.values()];
  const facultyRows = [...updatedFaculty.values()];

  console.log(`\nUpserting ${studentRows.length} student rows…`);
  if (studentRows.length) await upsertRows('students', studentRows);

  console.log(`Upserting ${facultyRows.length} faculty rows…`);
  if (facultyRows.length) await upsertRows('faculty', facultyRows);

  console.log('\nDone! Summary of changes:');
  for (const r of studentRows) {
    console.log(`  ${r.name}: overall=${r.overall}, w1=${r.week1}, w2=${r.week2}`);
  }
  for (const r of facultyRows) {
    console.log(`  [faculty] ${r.name}: overall=${r.overall}, w1=${r.week1}, w2=${r.week2}`);
  }
})();
