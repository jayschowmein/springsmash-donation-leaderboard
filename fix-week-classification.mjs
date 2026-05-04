// Fix week classification errors: Book2.xlsx is entirely "Week 1" cash donations,
// but the original script incorrectly put April-24 entries into week2.
// This script moves those donations to week1 without changing overall totals.
// Run with: node fix-week-classification.mjs

import { createClient } from './node_modules/@supabase/supabase-js/dist/index.mjs';

const supabase = createClient(
  'https://jayzzpdqyztonnotttvi.supabase.co',
  'sb_publishable_gyfFi-Kj2010lZf6V76aaw_Wh-lhv1W'
);

// Students to reclassify: move amount from week2 → week1 (overall unchanged)
const STUDENT_RECLASSIFY = [
  { id: 'S081', name: 'Tristan Dunlap Sanabria', amount: 1000 },
  { id: 'S029', name: 'Alston Wang',              amount:  500 },
  { id: 'S009', name: 'Scott Martin',             amount:  500 },
  { id: 'S023', name: 'Carter Gilroy',            amount:   60 },
];

const FACULTY_RECLASSIFY = [
  { id: 'F003', name: 'Kristen Wong', amount: 100 },
];

async function reclassify(table, entries) {
  for (const { id, name, amount } of entries) {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error) { console.error(`Failed to fetch ${name}:`, error); continue; }

    const newWeek1 = (data.week1 ?? 0) + amount;
    const newWeek2 = (data.week2 ?? 0) - amount;

    const { error: updateError } = await supabase.from(table)
      .update({ week1: newWeek1, week2: newWeek2 })
      .eq('id', id);

    if (updateError) {
      console.error(`Failed to update ${name}:`, updateError);
    } else {
      console.log(`✓ ${name}: week1 ${data.week1} → ${newWeek1}, week2 ${data.week2} → ${newWeek2} (overall ${data.overall} unchanged)`);
    }
  }
}

(async () => {
  console.log('Reclassifying student week1/week2 donations…');
  await reclassify('students', STUDENT_RECLASSIFY);

  console.log('\nReclassifying faculty week1/week2 donations…');
  await reclassify('faculty', FACULTY_RECLASSIFY);

  console.log('\nDone. Verifying final state…');
  for (const { id, name } of [...STUDENT_RECLASSIFY]) {
    const { data } = await supabase.from('students').select('*').eq('id', id).single();
    console.log(`  ${data.name}: overall=${data.overall} w1=${data.week1} w2=${data.week2}`);
  }
  for (const { id, name } of FACULTY_RECLASSIFY) {
    const { data } = await supabase.from('faculty').select('*').eq('id', id).single();
    console.log(`  [faculty] ${data.name}: overall=${data.overall} w1=${data.week1} w2=${data.week2}`);
  }
})();
