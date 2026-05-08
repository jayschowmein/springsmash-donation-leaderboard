// Week 3 update script: adds new roster entries + applies Week 3 donations
// Source: "Week 3 - NEW DONATIONS - May 5 at noon to end of week.xlsx"
// Cross-checked with: "donation_rankings_updated (1).xlsx"
// Run with: node update-week3.mjs

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

// ── New roster entries NOT yet in Supabase ───────────────────────────────────
// Includes students from Week 3 and previously-missed Week 2 donors.
// Pre-week3 amounts placed in week2 (consistent with their donation period).
// Advisory names preserve Mr./Ms./Mrs. prefixes per data convention.
const NEW_STUDENTS = [
  // Week 3-only donors (pre-week3 = 0)
  { id: 'S095', name: 'Ajax Chan',             grade: 11, division: 'US', house_or_clan: 'Ramsey',    is_boarder: false, advisory_group: 'Shanks',          overall: 0, week1: 0, week2: 0,    week3: 0, week4: 0 },
  { id: 'S096', name: 'Jeffrey Zhu',           grade:  7, division: 'MS', house_or_clan: 'MacDonald', is_boarder: false, advisory_group: 'Cahill',          overall: 0, week1: 0, week2: 0,    week3: 0, week4: 0 },
  { id: 'S097', name: 'Andy Wang',             grade: 12, division: 'US', house_or_clan: 'Smith',     is_boarder: false, advisory_group: 'Geoff Brennagh',  overall: 0, week1: 0, week2: 0,    week3: 0, week4: 0 },
  { id: 'S098', name: 'Ben Aiken',             grade: 10, division: 'US', house_or_clan: 'Perrier',   is_boarder: false, advisory_group: 'LaForge',         overall: 0, week1: 0, week2: 0,    week3: 0, week4: 0 },
  { id: 'S099', name: 'Brandon Sun',           grade: 12, division: 'US', house_or_clan: 'Perrier',   is_boarder: false, advisory_group: 'Foote',           overall: 0, week1: 0, week2: 0,    week3: 0, week4: 0 },
  { id: 'S100', name: 'Cole Ruple',            grade:  9, division: 'US', house_or_clan: 'Ramsey',    is_boarder: false, advisory_group: 'Commisso',        overall: 0, week1: 0, week2: 0,    week3: 0, week4: 0 },
  { id: 'S101', name: 'Jason Roy-Diclemente',  grade: 12, division: 'US', house_or_clan: 'Perrier',   is_boarder: false, advisory_group: 'McCue',           overall: 0, week1: 0, week2: 0,    week3: 0, week4: 0 },
  { id: 'S102', name: 'Kai Al-Joundi',         grade: 11, division: 'US', house_or_clan: 'Perrier',   is_boarder: false, advisory_group: 'Shanks',          overall: 0, week1: 0, week2: 0,    week3: 0, week4: 0 },
  { id: 'S103', name: 'Nyle Nadir',            grade:  9, division: 'US', house_or_clan: 'Laidlaw',   is_boarder: false, advisory_group: 'Zhou',            overall: 0, week1: 0, week2: 0,    week3: 0, week4: 0 },
  { id: 'S104', name: 'Ryan Li',               grade: 11, division: 'US', house_or_clan: 'Memorial',  is_boarder: false, advisory_group: 'Biasi',           overall: 0, week1: 0, week2: 0,    week3: 0, week4: 0 },
  { id: 'S105', name: 'Shaan Nadir',           grade: 11, division: 'US', house_or_clan: 'Laidlaw',   is_boarder: false, advisory_group: 'Zhou',            overall: 0, week1: 0, week2: 0,    week3: 0, week4: 0 },
  { id: 'S106', name: 'Student',               grade: 12, division: 'US', house_or_clan: 'Perrier',   is_boarder: false, advisory_group: 'Foote',           overall: 0, week1: 0, week2: 0,    week3: 0, week4: 0 },
  { id: 'S107', name: 'Travis Naylor',         grade: 10, division: 'US', house_or_clan: 'Smith',     is_boarder: false, advisory_group: 'Turley',          overall: 0, week1: 0, week2: 0,    week3: 0, week4: 0 },
  { id: 'S108', name: 'Matthew Sellan',        grade:  6, division: 'MS', house_or_clan: 'Bruce',     is_boarder: false, advisory_group: 'Dockerty',        overall: 0, week1: 0, week2: 0,    week3: 0, week4: 0 },
  { id: 'S109', name: 'Ashton Morrow',         grade: 11, division: 'US', house_or_clan: 'Smith',     is_boarder: false, advisory_group: 'Biasi',           overall: 0, week1: 0, week2: 0,    week3: 0, week4: 0 },
  // Previously-missed Week 2 donors (pre-week3 amounts in week2)
  { id: 'S110', name: 'Matthew Odd',           grade: 12, division: 'US', house_or_clan: 'Ramsey',    is_boarder: false, advisory_group: 'Paluch',          overall: 1000, week1: 0, week2: 1000, week3: 0, week4: 0 },
  { id: 'S111', name: 'Bradley Belanger',      grade:  8, division: 'MS', house_or_clan: 'Wallace',   is_boarder: false, advisory_group: 'Totera',          overall: 500,  week1: 0, week2: 500,  week3: 0, week4: 0 },
  { id: 'S112', name: 'Jack Brown',            grade: 10, division: 'US', house_or_clan: 'Sifton',    is_boarder: false, advisory_group: 'Auger',           overall: 500,  week1: 0, week2: 500,  week3: 0, week4: 0 },
  { id: 'S113', name: 'Santino Basile',        grade:  7, division: 'MS', house_or_clan: 'Bruce',     is_boarder: false, advisory_group: 'Markoff',         overall: 500,  week1: 0, week2: 500,  week3: 0, week4: 0 },
  { id: 'S114', name: 'Baichen luo',           grade: 11, division: 'US', house_or_clan: 'Laidlaw',   is_boarder: false, advisory_group: 'Bilton',          overall: 100,  week1: 0, week2: 100,  week3: 0, week4: 0 },
  { id: 'S115', name: 'Brian Gu',              grade:  7, division: 'MS', house_or_clan: 'Bruce',     is_boarder: false, advisory_group: 'Richardson',      overall: 100,  week1: 0, week2: 100,  week3: 0, week4: 0 },
  { id: 'S116', name: 'Casey Lee',             grade:  7, division: 'MS', house_or_clan: 'Montrose',  is_boarder: false, advisory_group: 'Minchella',       overall: 100,  week1: 0, week2: 100,  week3: 0, week4: 0 },
  { id: 'S117', name: 'Cooper Bordeaux',       grade: 12, division: 'US', house_or_clan: 'Flavelle',  is_boarder: false, advisory_group: 'Manning',         overall: 100,  week1: 0, week2: 100,  week3: 0, week4: 0 },
  { id: 'S118', name: 'Ethan Charter',         grade: 12, division: 'US', house_or_clan: 'Smith',     is_boarder: false, advisory_group: 'Madill',          overall: 100,  week1: 0, week2: 100,  week3: 0, week4: 0 },
  { id: 'S119', name: 'Hayden Lemaitre',       grade: 11, division: 'US', house_or_clan: 'Laidlaw',   is_boarder: false, advisory_group: 'Morrissey',       overall: 100,  week1: 0, week2: 100,  week3: 0, week4: 0 },
  { id: 'S120', name: 'Luca Pillitteri',       grade:  7, division: 'MS', house_or_clan: 'Wallace',   is_boarder: false, advisory_group: 'Cahill',          overall: 100,  week1: 0, week2: 100,  week3: 0, week4: 0 },
  { id: 'S121', name: 'William Taucar',        grade: 11, division: 'US', house_or_clan: 'Smith',     is_boarder: false, advisory_group: 'Mr. Ramon',       overall: 100,  week1: 0, week2: 100,  week3: 0, week4: 0 },
  { id: 'S122', name: 'Alexander Toor',        grade: 11, division: 'US', house_or_clan: 'Laidlaw',   is_boarder: false, advisory_group: 'Turley',          overall: 50,   week1: 0, week2: 50,   week3: 0, week4: 0 },
  { id: 'S123', name: 'Felix Irvine',          grade:  6, division: 'MS', house_or_clan: 'Bruce',     is_boarder: false, advisory_group: 'Collins',         overall: 50,   week1: 0, week2: 50,   week3: 0, week4: 0 },
  { id: 'S124', name: 'Arren Shah',            grade:  9, division: 'US', house_or_clan: 'Smith',     is_boarder: false, advisory_group: 'Franko',          overall: 25,   week1: 0, week2: 25,   week3: 0, week4: 0 },
];

// ── Week 3 donations (May 5 noon – end of week) ─────────────────────────────
// Aggregated from "Week 3 - NEW DONATIONS" xlsx.
// "EthanTaylor" (no space) normalised to "Ethan Taylor".
const WEEK3_STUDENT_DONATIONS = [
  { name: 'Ajax Chan',            amount: 3680   },  // 1000+25+1000+25+85+100+25+20+1000+100+100+200
  { name: 'Jeffrey Zhu',          amount: 1007.01 },
  { name: 'Ethan Taylor',         amount: 200    },  // 100+100 (existing S088)
  { name: 'Andy Wang',            amount: 100    },
  { name: 'Ben Aiken',            amount: 100    },
  { name: 'Brandon Sun',          amount: 100    },
  { name: 'Cole Ruple',           amount: 100    },
  { name: 'Jason Roy-Diclemente', amount: 100    },
  { name: 'Kai Al-Joundi',        amount: 100    },
  { name: 'Nyle Nadir',           amount: 100    },
  { name: 'Ryan Li',              amount: 100    },
  { name: 'Shaan Nadir',          amount: 100    },
  { name: 'Student',              amount: 100    },
  { name: 'Travis Naylor',        amount: 100    },
  { name: 'Matthew Sellan',       amount: 70     },  // 50+20
  { name: 'Peter Lakkotrypis',    amount: 50     },  // existing S062
  { name: 'Ashton Morrow',        amount: 25     },
];
// Week 3 total: $6,132.01

// ── Name normalisation ───────────────────────────────────────────────────────
function stripName(name) {
  return name.replace(/\(.*?\)/g, '').replace(/[^a-zA-Z]/g, '').toLowerCase();
}

function buildLookup(rows, nameField) {
  const map = new Map();
  for (const row of rows) {
    const key = stripName(row[nameField]);
    if (map.has(key)) console.warn(`  Duplicate normalised key "${key}" for "${row[nameField]}"`);
    map.set(key, row);
  }
  return map;
}

function findRow(map, donorName) {
  const key = stripName(donorName);
  if (map.has(key)) return map.get(key);
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
  console.log('Inserting new roster entries (30 students)…');
  if (NEW_STUDENTS.length) await upsertRows('students', NEW_STUDENTS);

  console.log('Fetching current data from Supabase…');
  const students = await fetchAll('students');
  console.log(`  ${students.length} students found`);

  const studentMap = buildLookup(students, 'name');
  const updatedStudents = new Map();
  const unmatched = [];

  function applyStudent(donorName, amount) {
    const row = findRow(studentMap, donorName);
    if (!row) { unmatched.push({ donorName, amount }); return; }
    const cur = updatedStudents.get(row.id) ?? { ...row };
    cur.week3   = (cur.week3   ?? 0) + amount;
    cur.overall = (cur.overall ?? 0) + amount;
    updatedStudents.set(row.id, cur);
  }

  console.log('\nApplying Week 3 donations…');
  for (const { name, amount } of WEEK3_STUDENT_DONATIONS) applyStudent(name, amount);

  if (unmatched.length) {
    console.warn('\n⚠ Unmatched donors:');
    for (const u of unmatched) console.warn(`  "${u.donorName}" — $${u.amount}`);
  } else {
    console.log('All donors matched successfully.');
  }

  const studentRows = [...updatedStudents.values()];
  console.log(`\nUpserting ${studentRows.length} updated student rows…`);
  if (studentRows.length) await upsertRows('students', studentRows);

  console.log('\nDone! Week 3 changes:');
  for (const r of studentRows) {
    console.log(`  ${r.name}: overall=${r.overall}, w3=${r.week3}`);
  }

  // Verification
  const final = await fetchAll('students');
  const totalDonations = final.reduce((sum, s) => sum + Number(s.overall), 0);
  console.log(`\nTotal student donations after update: $${totalDonations.toFixed(2)}`);
})();
