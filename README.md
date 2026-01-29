# FranOS MVP

FranOS is a personal operating system built with Next.js, Tailwind CSS, and Supabase.

## Features

- **Inbox**: Capture notes quickly.
- **Organization**: Convert notes to Tasks or Projects.
- **Views**: Today view (urgent tasks) and Project organization.
- **Review**: Weekly Review wizard to track progress and stats.
- **Search**: Global search across all entities.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Copy `.env.local.example` to `.env.local` and add your Supabase credentials.
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

3. **Database Setup**:
   Run the migration SQL scripts located in `supabase/` in your Supabase SQL Editor in this order:
   - `schema.sql` (Base)
   - `m3_migration.sql` (Tasks/Projects)
   - `m5_migration.sql` (Reviews)
   - `remove_auth.sql` (REQUIRED: Disables Auth for Private Mode)

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Private Mode (No Auth)
This application has been converted to a **Private Web App**.
- **No Login**: Authentication is disabled.
- **Single User**: Data is stored without user separation.
- **Security**: Row Level Security (RLS) is disabled. Do not expose this URL publicly without adding your own layer of protection (e.g. Vercel Basic Auth) if you have sensitive data.

## Deployment

This project is ready for deployment on [Vercel](https://vercel.com).

1. Push code to GitHub.
2. Import project in Vercel.
3. Add Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Vercel Project Settings.
4. Deploy.

## Testing

Access the smoke tests in `tests/smoke.spec.ts`.
