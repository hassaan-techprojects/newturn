# NewTurn — Sell your 5G phone

A Next.js + TypeScript platform for selling used 5G smartphones in Bengaluru.

## Stack
- Next.js App Router + TypeScript
- PostgreSQL on Neon via `@neondatabase/serverless`
- Tailwind CSS
- Server-side APIs for customer applications, valuations and admin reporting

## Local setup
1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL` to the Neon pooled connection string.
3. Configure admin credentials and an OTP provider before enabling production sign-in.
4. Run the SQL in `database/schema.sql` against the intended Neon branch.
5. Run `npm install` and `npm run dev`.

## Important
- The database migration is explicit; the application does not silently create tables.
- Dashboard totals must be calculated from persisted records, never demo counters.
- OTP delivery requires a real SMS/email provider. Never expose OTP secrets in client code.
- Only devices marked 5G-enabled should be published in the customer catalogue.
- Bengaluru is the initial service city; pickup coverage must be validated before an order is confirmed.

## Current implementation status
Initial Next.js project foundation and product direction. Configure and verify Neon access, OTP delivery, pricing rules and pickup coverage before production launch.
