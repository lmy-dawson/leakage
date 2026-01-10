# Leakage - Vercel + Supabase Setup

## Prerequisites
- Vercel account (vercel.com)
- Supabase account (supabase.com)

## Step 1: Create Supabase Database

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. In the SQL editor, create the `waitlist` table:

```sql
CREATE TABLE waitlist (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_waitlist_email ON waitlist(email);
```

4. Go to **Settings → API** and copy:
   - `Project URL` (SUPABASE_URL)
   - `anon public` key (SUPABASE_ANON_KEY)

## Step 2: Deploy to Vercel

1. Push code to GitHub:
```bash
git add .
git commit -m "Add Supabase integration for Vercel"
git push origin main
```

2. Go to [vercel.com](https://vercel.com) and import your GitHub repo
3. Set environment variables:
   - `SUPABASE_URL` = Your Supabase URL
   - `SUPABASE_ANON_KEY` = Your Supabase anon key

4. Click Deploy

## Step 3: Test Locally (Optional)

```bash
npm install
vercel env pull  # Pulls environment variables
vercel dev       # Runs locally on localhost:3000
```

## API Endpoints

**POST /api/waitlist**
```bash
curl -X POST https://your-domain.vercel.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**GET /api/waitlist**
```bash
curl https://your-domain.vercel.app/api/waitlist
```

## File Structure

```
├── index.html          # Landing page
├── api/
│   └── waitlist.js     # Vercel serverless function
├── vercel.json         # Vercel config
├── package.json        # Dependencies
└── .env.local          # Local environment variables
```

## Features

✅ Serverless (auto-scaling)  
✅ Email validation  
✅ Duplicate prevention  
✅ Fast Supabase queries  
✅ No server maintenance  

## Troubleshooting

**"Missing Supabase environment variables"**
- Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in Vercel

**"Email already on waitlist"**
- User's email is already in the database

**"Invalid email address"**
- Email format is incorrect
