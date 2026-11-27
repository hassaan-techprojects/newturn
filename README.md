# NewTurn — Sell your 5G phone

A Next.js + TypeScript platform for selling used 5G smartphones in Bengaluru.

## Stack
- Next.js 16 App Router + TypeScript
- Neon PostgreSQL via `@neondatabase/serverless`
- Neon Managed Better Auth via `@neon/auth`
- Tailwind CSS

## Neon Auth setup
The `production` branch of Neon project `green-wave-93924097` has Managed Better Auth enabled.

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Keep the `NEON_AUTH_BASE_URL` value from the example (or pull the branch env with `neon env pull`).
4. Generate a private cookie secret with `openssl rand -base64 32` and set it as `NEON_AUTH_COOKIE_SECRET`. Never commit this value.
5. Run `npm run dev`.
6. Visit `/auth/sign-up` to create an account, then `/auth/sign-in` and `/account` to verify sign-in and the current session.

The local origin `http://localhost:3000` is allowlisted on the production branch. The branch currently uses Neon's shared email provider and does not require email verification for sign-up. Configure custom SMTP before production launch.

## Neon CLI / branch config
The repository contains `neon.ts` with `auth: true`. From an authenticated local terminal, run:

```bash
npm install -g neon@latest
neon login
neon init -y --project-id green-wave-93924097 --branch production --services postgres,auth
neon deploy
```

If global installation is unavailable, use `npx neon@latest` in place of `neon`. Check the CLI's proposed changes before accepting any unexpected configuration edits.

## Business data setup
1. Set `DATABASE_URL` to the production branch's pooled PostgreSQL connection string.
2. Review and run `database/schema.sql` against the intended branch when ready.
3. Configure admin access separately; customer sign-up must never grant admin privileges.

## Important
- Neon Auth users and sessions live in the managed `neon_auth` schema.
- The business customer/application tables are separate and are not created by Better Auth.
- Dashboard totals must be calculated from persisted records, never demo counters.
- Only verified 5G devices should be published in the customer catalogue.
- Bengaluru is the initial service city; pickup coverage must be validated before an order is confirmed.
- Do not commit `.env.local`, database URLs, cookie secrets, or provider credentials.

## Current implementation status
Email/password sign-up, sign-in, session display, sign-out, auth proxy and Neon branch configuration are implemented in the repository. Run the local setup and complete the real-user test before treating authentication as production verified.
