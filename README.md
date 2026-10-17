# CSE SkillSync

A React single-page app built with Vite. The current screens use hash-based navigation and in-memory demo data.

## Getting started

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, or preview it locally with `npm run preview`.

## Project structure

- `src/App.jsx` — app state, hash navigation, and shared page layout
- `src/components/` — shared UI components and app navigation
- `src/context/` — React context for app state
- `src/data/` — demo data and shared utilities
- `src/pages/` — route-specific page components
- `src/styles.css` — global styles
- `src/main.jsx` — React entry point
# Supabase authentication setup

1. In the Supabase dashboard, open **Authentication → Providers → Email** and enable email signups.
2. Under **Authentication → URL Configuration**, set the Site URL to the app's local URL while developing (usually `http://localhost:5173`). Add that URL to the allowed redirect URLs. Add your deployed app URL before deploying.
3. Copy the project's URL and publishable key from **Project Settings → API** into `.env` using the names in `.env.example`. Vite reads `VITE_` variables; restart the dev server after changing `.env`.
4. Run `npm run dev`, open the app, and create an account. If email confirmation is enabled, confirm the email before logging in. Supabase creates the auth user; name, institution, role, and skill lists are stored in that user's metadata.

The app restores the Supabase session on reload and signs out through Supabase. Signup metadata is read from `auth.users.user_metadata`; no profile table is required for this implementation. If you later add a public profiles table, enable row level security and add policies before storing user profile rows there.

