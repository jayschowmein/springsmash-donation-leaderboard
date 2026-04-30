-- ============================================================
-- SpringSmash 2026 — Supabase Database Setup
-- Run this entire script in the Supabase SQL Editor:
--   https://supabase.com/dashboard/project/jayzzpdqyztonnotttvi/sql
-- ============================================================

-- 1. Create tables
CREATE TABLE IF NOT EXISTS public.students (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  grade          INTEGER NOT NULL,
  division       TEXT NOT NULL,
  house_or_clan  TEXT NOT NULL,
  is_boarder     BOOLEAN NOT NULL DEFAULT false,
  advisory_group TEXT NOT NULL,
  overall        NUMERIC NOT NULL DEFAULT 0,
  week1          NUMERIC NOT NULL DEFAULT 0,
  week2          NUMERIC NOT NULL DEFAULT 0,
  week3          NUMERIC NOT NULL DEFAULT 0,
  week4          NUMERIC NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.faculty (
  id      TEXT PRIMARY KEY,
  name    TEXT NOT NULL,
  overall NUMERIC NOT NULL DEFAULT 0,
  week1   NUMERIC NOT NULL DEFAULT 0,
  week2   NUMERIC NOT NULL DEFAULT 0,
  week3   NUMERIC NOT NULL DEFAULT 0,
  week4   NUMERIC NOT NULL DEFAULT 0
);

-- 2. Grant anon key full access (required for the app to read/write)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faculty  TO anon;

-- 3. Disable RLS (simplest for an internal leaderboard app)
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty  DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. Insert student roster with Week 1 + Week 2 donations
--    Columns: id, name, grade, division, house_or_clan,
--             is_boarder, advisory_group,
--             overall, week1, week2, week3, week4
--
--    Week 1 source : Book2.xlsx (cash, dates before Apr 24)
--    Week 2 source : Week 2 CSV (online) + Book2 cash (Apr 24+)
--
--    is_boarder defaults to false — update via Admin Panel
--    if boarding status is known.
-- ============================================================

INSERT INTO public.students
  (id, name, grade, division, house_or_clan, is_boarder, advisory_group,
   overall, week1, week2, week3, week4)
VALUES
-- ── Grade 5 ──────────────────────────────────────────────────
('S001','Ian Li',5,'MS','Montrose',false,'Holmes',100,0,100,0,0),
('S002','Ari Zareian',5,'MS','Douglas',false,'Kaszuba',100,0,100,0,0),
('S003','Dean Porter',5,'MS','Bruce',false,'Kaszuba',100,100,0,0,0),
-- ── Grade 6 ──────────────────────────────────────────────────
('S004','Joshua Triassi',6,'MS','Wallace',false,'Morra',100,0,100,0,0),
('S005','Jackson Prokopchuk',6,'MS','Montrose',false,'Morra',100,0,100,0,0),
('S006','Alen Fazlic',6,'MS','Bruce',false,'Kim',500,0,500,0,0),
('S007','Weston Wambolt',6,'MS','Douglas',false,'Morra',1000,500,500,0,0),
('S008','Charles Ji',6,'MS','Bruce',false,'Morra',100,0,100,0,0),
('S009','Scott Martin',6,'MS','Douglas',false,'Collins',700,0,700,0,0),
('S010','Reid Berwick',6,'MS','Wallace',false,'Morra',100,0,100,0,0),
('S011','Brody Berwick',6,'MS','Wallace',false,'Dockerty',250,0,250,0,0),
('S012','Dante Mizzi',6,'MS','Wallace',false,'Kim',150,0,150,0,0),
('S013','Mikhail Damji',6,'MS','Bruce',false,'Dockerty',500,0,500,0,0),
('S014','Larson Froats',6,'MS','Douglas',false,'Kim',50,0,50,0,0),
('S015','Kyler Chen',6,'MS','Montrose',false,'Morra',100,100,0,0,0),
('S016','Nicholas Gallo',6,'MS','Bruce',false,'Collins',250,250,0,0,0),
-- ── Grade 7 ──────────────────────────────────────────────────
('S017','Bosco Yang',7,'MS','Bruce',false,'Cahill',75,0,75,0,0),
('S018','Jax Whiteside',7,'MS','Montrose',false,'Markoff',200,0,200,0,0),
('S019','Eason Zhang',7,'MS','Montrose',false,'Richardson',100,0,100,0,0),
('S020','Hudson Ofield-Kada',7,'MS','Bruce',false,'Minchella',700,0,700,0,0),
('S021','Domenico Crupi',7,'MS','Bruce',false,'Minchella',100,0,100,0,0),
('S022','Lucas He',7,'MS','Douglas',false,'Kim',200,0,200,0,0),
('S023','Carter Gilroy',7,'MS','Montrose',false,'Balendran',60,0,60,0,0),
-- ── Grade 8 ──────────────────────────────────────────────────
('S024','Maxim Quigley',8,'MS','Bruce',false,'Kowaltschuk',100,0,100,0,0),
('S025','Yosef Shui',8,'MS','Wallace',false,'Kowaltschuk',100,0,100,0,0),
('S026','Luca Sandru',8,'MS','Douglas',false,'Ramon',100,0,100,0,0),
('S027','Wilshere Tung',8,'MS','Bruce',false,'Ramon',285,0,285,0,0),
('S028','Cruz Necovski',8,'MS','Bruce',false,'Porter',400,0,400,0,0),
('S029','Alston Wang',8,'MS','Bruce',false,'Knox',500,0,500,0,0),
('S030','Adrian Belan',8,'MS','Douglas',false,'Ramon',100,100,0,0,0),
('S031','William Wang',8,'MS','Wallace',false,'Totera',100,100,0,0,0),
('S032','Sean-Carlo Tian',8,'MS','Wallace',false,'Ramon',100,100,0,0,0),
-- ── Grade 9 ──────────────────────────────────────────────────
('S033','Matteo Triassi',9,'US','Smith',false,'Liu',100,0,100,0,0),
('S034','Massimo Cesana',9,'US','Smith',false,'Kashtelyan',250,0,250,0,0),
('S035','Anthony Jackson',9,'US','Smith',false,'Thompson-Hitchins',100,0,100,0,0),
('S036','Sam Whiteside',9,'US','Laidlaw',false,'Abes',100,0,100,0,0),
('S037','Kieran Charter',9,'US','Smith',false,'Madill',100,0,100,0,0),
('S038','Nate Berwick',9,'US','Smith',false,'Morrissey',100,0,100,0,0),
('S039','Riley Weedon',9,'US','Perrier',false,'Fraser-McIntosh',25,0,25,0,0),
('S040','Yue Jasper Yu',9,'US','Smith',false,'Lawrence',2000,0,2000,0,0),
('S041','Roman Di Girolamo',9,'US','Laidlaw',false,'Fraser-McIntosh',100,0,100,0,0),
('S042','Duncan Ramon',9,'US','Perrier',false,'Turley',100,100,0,0,0),
-- ── Grade 10 ─────────────────────────────────────────────────
('S043','Luke Haggith',10,'US','Perrier',false,'Biasi',300,0,300,0,0),
('S044','Jackson Boyd',10,'US','Ramsey',false,'Cowell',200,0,200,0,0),
('S045','Joshua Passero',10,'US','Laidlaw',false,'Fraser-McIntosh',2050,100,1950,0,0),
('S046','Charles Battiston',10,'US','Memorial',false,'Kaloti',300,0,300,0,0),
('S047','Entong Miao',10,'US','Memorial',false,'Cowell',250,0,250,0,0),
('S048','Darius Abdulla',10,'US','Laidlaw',false,'Carroll',100,0,100,0,0),
('S049','Eddie Duicu',10,'US','Ramsey',false,'Numa',50,0,50,0,0),
('S050','Philip Malkhassian',10,'US','Perrier',false,'MacIsaac',100,0,100,0,0),
('S051','Gabriel Covello',10,'US','Ramsey',false,'Turley',50,0,50,0,0),
('S052','Terrance Yu',10,'US','Memorial',false,'McHenry',100,0,100,0,0),
('S053','Gabriel Santocono',10,'US','Sifton',false,'Goncharouk',250,0,250,0,0),
('S054','Logan Viau',10,'US','Ramsey',false,'Prezens',200,0,200,0,0),
('S055','Patrick Campagna',10,'US','Smith',false,'Berman',100,0,100,0,0),
('S056','Hayes Mantrop',10,'US','Memorial',false,'Papalia',100,100,0,0,0),
('S057','George Ince',10,'US','Sifton',false,'Prezens',100,100,0,0,0),
-- ── Grade 11 ─────────────────────────────────────────────────
('S058','Victor Waite',11,'US','Memorial',false,'Foote',100,0,100,0,0),
('S059','Colby Smith',11,'US','Smith',false,'Commisso',100,0,100,0,0),
('S060','Alexander Quigley',11,'US','Smith',false,'Carroll',200,0,200,0,0),
('S061','Gavin Zepp',11,'US','Smith',false,'McLoughlin',350,0,350,0,0),
('S062','Peter Lakkotrypis',11,'US','Perrier',false,'McMillan',275,0,275,0,0),
('S063','Hunter Wilson',11,'US','Flavelle',false,'Johnston',100,0,100,0,0),
('S064','Kai MacDonald',11,'US','Flavelle',false,'Lio',75,0,75,0,0),
('S065','Frederik Koopmann',11,'US','Sifton',false,'MacPherson',100,0,100,0,0),
('S066','Hayden Stroud',11,'US','Flavelle',false,'Morrissey',100,0,100,0,0),
('S067','Ethan Schembri',11,'US','MacDonald',false,'Abes',100,0,100,0,0),
('S068','Finn Crix',11,'US','Memorial',false,'Gilroy',100,0,100,0,0),
('S069','Adam Butt',11,'US','Flavelle',false,'Bilton',50,0,50,0,0),
('S070','Jack Young',11,'US','Flavelle',false,'Gate',100,0,100,0,0),
('S071','Darien Abdulla',11,'US','Laidlaw',false,'Bunten',100,0,100,0,0),
-- ── Grade 12 ─────────────────────────────────────────────────
('S072','Bob Tao',12,'US','Laidlaw',false,'Tackaberry',100,0,100,0,0),
('S073','Nantus Baard',12,'US','Flavelle',false,'LaForge',100,0,100,0,0),
('S074','Andrew Mouratidis',12,'US','Laidlaw',false,'Scoular',100,0,100,0,0),
('S075','Sam Gao',12,'US','Sifton',false,'Jaekel',100,0,100,0,0),
('S076','Parker Bifolchi',12,'US','Memorial',false,'Kitagawa',100,0,100,0,0),
('S077','Michael Murphy',12,'US','Laidlaw',false,'Ludwig',100,0,100,0,0),
('S078','Carson Vogel',12,'US','Flavelle',false,'Bunten',300,0,300,0,0),
('S079','Nicholas Chan',12,'US','Sifton',false,'Horner',100,0,100,0,0),
('S080','Jayden Leung',12,'US','Sifton',false,'Carroll',100,0,100,0,0),
('S081','Tristan Dunlap Sanabria',12,'US','Memorial',false,'Guldemond',1000,0,1000,0,0),
('S082','Hugh Murray',12,'US','Laidlaw',false,'Gate',50,50,0,0,0),
('S083','Carson Medcalf',12,'US','Sifton',false,'Lio',100,100,0,0,0)
ON CONFLICT (id) DO UPDATE SET
  name           = EXCLUDED.name,
  grade          = EXCLUDED.grade,
  division       = EXCLUDED.division,
  house_or_clan  = EXCLUDED.house_or_clan,
  is_boarder     = EXCLUDED.is_boarder,
  advisory_group = EXCLUDED.advisory_group,
  overall        = EXCLUDED.overall,
  week1          = EXCLUDED.week1,
  week2          = EXCLUDED.week2,
  week3          = EXCLUDED.week3,
  week4          = EXCLUDED.week4;

-- ============================================================
-- 5. Faculty roster with Week 2 donations
-- ============================================================

INSERT INTO public.faculty (id, name, overall, week1, week2, week3, week4)
VALUES
  ('F001','Jessica Auger',100,0,100,0,0),
  ('F002','Sean Ludwig',100,0,100,0,0),
  ('F003','Kristen Wong',100,0,100,0,0)
ON CONFLICT (id) DO UPDATE SET
  name    = EXCLUDED.name,
  overall = EXCLUDED.overall,
  week1   = EXCLUDED.week1,
  week2   = EXCLUDED.week2,
  week3   = EXCLUDED.week3,
  week4   = EXCLUDED.week4;

-- ============================================================
-- Done! Verify with:
--   SELECT count(*) FROM public.students;   -- should be 83
--   SELECT count(*) FROM public.faculty;    -- should be 3
--   SELECT sum(overall) FROM public.students;
--   SELECT sum(overall) FROM public.faculty;
-- ============================================================
