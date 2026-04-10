# springsmash-donation-leaderboard

## Supabase backend setup

This project now stores leaderboard data in Supabase so admin uploads and updates are shared live across users.

### 1. Create a Supabase project
1. Go to https://app.supabase.com and sign in / sign up.
2. Create a new project.
3. Open the project and copy the `API URL` and `anon public` key.

### 2. Create database tables
Run the following SQL in Supabase SQL editor:

```sql
create table students (
  id text primary key,
  name text not null,
  grade int not null,
  division text not null,
  house_or_clan text not null,
  is_boarder boolean not null,
  advisory_group text not null,
  overall numeric not null default 0,
  week1 numeric not null default 0,
  week2 numeric not null default 0,
  week3 numeric not null default 0,
  week4 numeric not null default 0
);

create table faculty (
  id text primary key,
  name text not null,
  overall numeric not null default 0,
  week1 numeric not null default 0,
  week2 numeric not null default 0,
  week3 numeric not null default 0,
  week4 numeric not null default 0
);
```

### 3. Configure environment variables
Create a `.env` file at the project root with:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

There's also a `.env.example` included as a template.

### 4. Install the new dependency

```bash
npm install
```

### 5. Run locally

```bash
npm run dev
```

### 6. Deployment

If deploying to Vercel, add the same environment variables in the Vercel project settings.
