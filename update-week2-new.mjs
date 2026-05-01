// Incremental script: applies NEW Week 2 donations (April 29 3pm – May 1 9am)
// These are additions on top of the already-applied Week 1 & Week 2 data.
// Run with: node update-week2-new.mjs

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

// ── New Week 2 donations: April 29 3pm – May 1 9am ───────────────────────────
// "Brody Beewick" in source file is a typo for "Brody Berwick" (matches roster).
const NEW_WEEK2_STUDENT_DONATIONS = [
  { name: 'Dante Mizzi',    amount:  100 },
  { name: 'Jack Lalor',     amount:  250 },
  { name: 'Chen Yu Zhang',  amount:  100 },
  { name: 'Nolan Long',     amount:  100 },
  { name: 'Jayden Leung',   amount:  150 }, // 100 + 50 combined
  { name: 'Brody Berwick',  amount:  100 }, // spelled "Beewick" in source — corrected
  { name: 'Justin Li',      amount:  520 }, // 250+100+20+50+50+50
  { name: 'Ethan Taylor',   amount: 1250 }, // 50+500+50+100+200+100+250
  { name: 'Silas Li',       amount:   50 },
  { name: 'Carter Sutton',  amount:  100 },
  { name: 'Gill Suddard',   amount:  100 },
  { name: 'Keaton Davey',   amount:  250 },
  { name: 'Taylor Xu',      amount:  200 },
  { name: 'Ethan Zhang',    amount: 1000 },
];

const NEW_WEEK2_FACULTY_DONATIONS = [
  { name: 'Carolyn Bilton', amount: 100 },
];

// ── New roster entries (not yet in Supabase) ─────────────────────────────────
// Students from the new Excel file who weren't in the original roster.
// Advisory group = advisor last name, consistent with existing records.
const NEW_STUDENTS = [
  { id: 'S084', name: 'Jack Lalor',    grade: 12, division: 'US', house_or_clan: 'Flavelle',  is_boarder: false, advisory_group: 'Turley',    overall: 0, week1: 0, week2: 0, week3: 0, week4: 0 },
  { id: 'S085', name: 'Chen Yu Zhang', grade: 12, division: 'US', house_or_clan: 'Laidlaw',   is_boarder: false, advisory_group: 'Bunten',    overall: 0, week1: 0, week2: 0, week3: 0, week4: 0 },
  { id: 'S086', name: 'Nolan Long',    grade: 12, division: 'US', house_or_clan: 'Sifton',    is_boarder: false, advisory_group: 'Gate',      overall: 0, week1: 0, week2: 0, week3: 0, week4: 0 },
  { id: 'S087', name: 'Justin Li',     grade:  9, division: 'US', house_or_clan: 'MacDonald', is_boarder: false, advisory_group: 'Franko',    overall: 0, week1: 0, week2: 0, week3: 0, week4: 0 },
  { id: 'S088', name: 'Ethan Taylor',  grade: 11, division: 'US', house_or_clan: 'Laidlaw',   is_boarder: false, advisory_group: 'Commisso',  overall: 0, week1: 0, week2: 0, week3: 0, week4: 0 },
  { id: 'S089', name: 'Silas Li',      grade:  7, division: 'MS', house_or_clan: 'Wallace',   is_boarder: false, advisory_group: 'Minchella', overall: 0, week1: 0, week2: 0, week3: 0, week4: 0 },
  { id: 'S090', name: 'Carter Sutton', grade:  8, division: 'MS', house_or_clan: 'Douglas',   is_boarder: false, advisory_group: 'Porter',    overall: 0, week1: 0, week2: 0, week3: 0, week4: 0 },
  { id: 'S091', name: 'Gill Suddard',  grade: 12, division: 'US', house_or_clan: 'Sifton',    is_boarder: false, advisory_group: 'Gate',      overall: 0, week1: 0, week2: 0, week3: 0, week4: 0 },
  { id: 'S092', name: 'Keaton Davey',  grade:  9, division: 'US', house_or_clan: 'Ramsey',    is_boarder: false, advisory_group: 'Jaekel',    overall: 0, week1: 0, week2: 0, week3: 0, week4: 0 },
  { id: 'S093', name: 'Taylor Xu',     grade:  6, division: 'MS', house_or_clan: 'Wallace',   is_boarder: false, advisory_group: 'Kim',       overall: 0, week1: 0, week2: 0, week3: 0, week4: 0 },
  { id: 'S094', name: 'Ethan Zhang',   grade:  7, division: 'MS', house_or_clan: 'Bruce',     is_boarder: false, advisory_group: 'Balendran', overall: 0, week1: 0, week2: 0, week3: 0, week4: 0 },
];

const NEW_FACULTY = [
  { id: 'F004', name: 'Carolyn Bilton', overall: 0, week1: 0, week2: 0, week3: 0, week4: 0 },
];

// ── Name normalisation ───────────────────────────────────────────────────────
function stripName(name) {
  return name
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-zA-Z]/g, '')
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
    for (const [k, v] of map) {
      if (k.startsWith(stripName(parts[0])) && k.endsWith(stripName(parts[parts.length - 1]))) {
        return v;
      }
    }
  }
  return null;
}

// ── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log('Inserting new roster entries…');
  if (NEW_STUDENTS.length) await upsertRows('students', NEW_STUDENTS);
  if (NEW_FACULTY.length)  await upsertRows('faculty',  NEW_FACULTY);

  console.log('Fetching current data from Supabase…');
  const students = await fetchAll('students');
  const faculty  = await fetchAll('faculty');
  console.log(`  ${students.length} students, ${faculty.length} faculty found`);

  const studentMap = buildLookup(students, 'name');
  const facultyMap = buildLookup(faculty,  'name');

  const updatedStudents = new Map();
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

  console.log('\nApplying new Week 2 student donations…');
  for (const { name, amount } of NEW_WEEK2_STUDENT_DONATIONS) applyStudent(name, 'week2', amount);

  console.log('Applying new Week 2 faculty donations…');
  for (const { name, amount } of NEW_WEEK2_FACULTY_DONATIONS) applyFaculty(name, 'week2', amount);

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
    console.log(`  ${r.name}: overall=${r.overall}, w2=${r.week2}`);
  }
  for (const r of facultyRows) {
    console.log(`  [faculty] ${r.name}: overall=${r.overall}, w2=${r.week2}`);
  }
})();
