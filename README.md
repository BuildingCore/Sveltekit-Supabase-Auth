# SvelteKit + Supabase Auth Template (with Inactivity Auto-Logout)


**Developed by Keyshaun Ward**

Drop-in auth scaffolding for new SvelteKit projects:
- Login and sign-up via Supabase
- Server-side session handling via @supabase/ssr
- Inactivity auto-logout (client immediately + server on next request)
- API endpoints for heartbeat and logout
- Protected /app routes with a layout that starts the watcher

## 1) Install dependencies

Ensure these are in your project:
- @sveltejs/kit, svelte, vite (typical SvelteKit)
- @supabase/ssr, @supabase/supabase-js, @supabase/auth-helpers-sveltekit

## 2) Configure env

Create `.env` with:

PUBLIC_SUPABASE_URL=your_url
PUBLIC_SUPABASE_ANON_KEY=your_anon_key

## 3) Copy files

Copy the contents of `templates/sveltekit-supabase-auth/src/` into your project's `src/`.

This includes:
- hooks.server.ts
- app.d.ts
- lib/supabaseClient.ts
- lib/config.ts
- lib/inactivity.ts
- routes/+layout.server.ts
- routes/auth/+page.server.ts
- routes/auth/+page.svelte
- routes/api/activity/+server.ts
- routes/api/logout/+server.ts
- routes/app/+layout.svelte (runs watcher only on protected routes)
- routes/app/+page.svelte (sample protected page)

## 4) Optional: change protected base

By default, protected pages live under `/app`. Change `PROTECTED_BASE` in `lib/config.ts` and update any redirects if you want a different path.

## 5) Try it

- Start the dev server, visit `/auth`, sign up or log in.
- Navigate to `/app`.
- Stop interacting; after 10 minutes the app will redirect to `/auth?reason=inactive`.
- While active (mouse/keys/scroll), your session stays fresh.

## Notes

- Server still enforces inactivity on every request.
- The client watcher runs only inside `/app`.
- Adjust the inactivity limit in `lib/config.ts`.
