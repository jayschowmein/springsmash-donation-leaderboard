export type Division = "US" | "MS";

export type WeekKey = "overall" | "week1" | "week2" | "week3" | "week4";

export type StudentTotals = Record<WeekKey, number>;

export interface Student {
  id: string;
  name: string;
  grade: number;
  division: Division;
  houseOrClan: string;
  isBoarder: boolean;
  advisoryGroup: string;
  totals: StudentTotals;
}

export interface FacultyTotals extends Record<WeekKey, number> {}

export interface Faculty {
  id: string;
  name: string;
  totals: FacultyTotals;
}

const makeStudent = (
  id: string,
  name: string,
  grade: number,
  division: Division,
  houseOrClan: string,
  isBoarder: boolean,
  advisoryGroup: string,
  overall: number,
  w1: number,
  w2: number,
  w3: number,
  w4: number
): Student => ({
  id,
  name,
  grade,
  division,
  houseOrClan,
  isBoarder,
  advisoryGroup,
  totals: {
    overall,
    week1: w1,
    week2: w2,
    week3: w3,
    week4: w4
  }
});

const makeFaculty = (
  id: string,
  name: string,
  overall: number,
  w1: number,
  w2: number,
  w3: number,
  w4: number
): Faculty => ({
  id,
  name,
  totals: {
    overall,
    week1: w1,
    week2: w2,
    week3: w3,
    week4: w4
  }
});

// Upper School Houses
const US_HOUSES = [
  "Perrier House",
  "Ramsey House",
  "Laidlaw House",
  "Smith House",
  "MacDonald House",
  "Sifton House",
  "Flavelle House",
  "Memorial House"
];

// Middle School Clans
const MS_CLANS = ["Bruce Clan", "Montrose Clan", "Wallace Clan", "Douglas Clan"];

// US Advisories (example labels)
const US_ADVISORIES = [
  "US Advisory 1",
  "US Advisory 2",
  "US Advisory 3",
  "US Advisory 4",
  "US Advisory 5",
  "US Advisory 6",
  "US Advisory 7",
  "US Advisory 8",
  "US Advisory 9",
  "US Advisory 10"
];

// MS Advisories (example labels)
const MS_ADVISORIES = [
  "MS Advisory 1",
  "MS Advisory 2",
  "MS Advisory 3",
  "MS Advisory 4",
  "MS Advisory 5",
  "MS Advisory 6"
];

// Simple helper to generate placeholder names
const firstNames = [
  "Alex",
  "Jordan",
  "Taylor",
  "Riley",
  "Casey",
  "Morgan",
  "Quinn",
  "Hayden",
  "Skyler",
  "Rowan",
  "Blake",
  "Peyton",
  "Drew",
  "Avery",
  "Jamie"
];

const lastNames = [
  "Park",
  "Lennox",
  "Harper",
  "Ellis",
  "Reid",
  "Sawyer",
  "Brooks",
  "Marlow",
  "Hayes",
  "Finch",
  "Wells",
  "Tate",
  "Lane",
  "Carter",
  "Monroe"
];

let studentCounter = 1;

const randomFrom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const makeName = () => `${randomFrom(firstNames)} ${randomFrom(lastNames)}`;

const randAmount = (base: number, spread: number) =>
  Math.max(0, Math.round((base + (Math.random() - 0.5) * spread) / 5) * 5);

const buildStudents = (): Student[] => {
  const students: Student[] = [];

  // Middle School: grades 5–8 (day-focused)
  for (let grade = 5; grade <= 8; grade++) {
    for (let i = 0; i < 8; i++) {
      const name = makeName();
      const advisory = randomFrom(MS_ADVISORIES);
      const clan = randomFrom(MS_CLANS);

      const w1 = randAmount(40, 40);
      const w2 = randAmount(40, 40);
      const w3 = randAmount(40, 40);
      const w4 = randAmount(40, 40);
      const overall = w1 + w2 + w3 + w4;

      students.push(
        makeStudent(
          `S${studentCounter++}`,
          name,
          grade,
          "MS",
          clan,
          false,
          advisory,
          overall,
          w1,
          w2,
          w3,
          w4
        )
      );
    }
  }

  // Upper School: grades 9–12 (boarders + day boys)
  for (let grade = 9; grade <= 12; grade++) {
    for (let i = 0; i < 10; i++) {
      const name = makeName();
      const advisory = randomFrom(US_ADVISORIES);
      const house = randomFrom(US_HOUSES);
      const isBoarder = Math.random() < 0.55;

      const w1 = randAmount(75, 75);
      const w2 = randAmount(75, 75);
      const w3 = randAmount(75, 75);
      const w4 = randAmount(75, 75);
      const overall = w1 + w2 + w3 + w4;

      students.push(
        makeStudent(
          `S${studentCounter++}`,
          name,
          grade,
          "US",
          house,
          isBoarder,
          advisory,
          overall,
          w1,
          w2,
          w3,
          w4
        )
      );
    }
  }

  return students;
};

const buildFaculty = (): Faculty[] => [
  makeFaculty("F1", "Ms. Cameron", 620, 150, 140, 160, 170),
  makeFaculty("F2", "Mr. Patel", 540, 120, 130, 130, 160),
  makeFaculty("F3", "Dr. Nguyen", 480, 100, 120, 120, 140),
  makeFaculty("F4", "Ms. Rossi", 430, 90, 110, 120, 110),
  makeFaculty("F5", "Mr. Thompson", 390, 80, 90, 110, 110),
  makeFaculty("F6", "Ms. Li", 360, 70, 80, 90, 120)
];

export const seedStudents: Student[] = [];

export const seedFaculty: Faculty[] = [];

