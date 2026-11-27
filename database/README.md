# NewTurn database setup

The application uses the existing Neon project `green-wave-93924097`, production branch, database `neondb`.

## Apply the initial schema

From the repository root in PowerShell:

```powershell
npx neon@latest login
npx neon@latest connection-string production --project-id green-wave-93924097 --database-name neondb --role-name neondb_owner --psql -- -f database/migrations/001_newturn_core.sql
```

The migration creates the catalogue, variants, model-specific defect deductions, customers, incomplete applications, orders and activity log. It seeds the initial 5G catalogue with editable provisional values.

## Use a least-privilege app role

After the schema has been applied, create a scoped application role:

```powershell
npx neon@latest roles create --name newturn_app --access read_write --database neondb --schema public --branch production --project-id green-wave-93924097
```

Then retrieve a pooled connection string for the app role:

```powershell
npx neon@latest connection-string production --project-id green-wave-93924097 --database-name neondb --role-name newturn_app --pooled
```

Copy that connection string directly into Vercel Project Settings → Environment Variables as `DATABASE_URL` for Production, Preview and Development. Do not paste it into GitHub or chat.

For local development, use:

```powershell
npx neon@latest env pull --branch production --file .env.local --service postgres
```

## Important

- Use the database owner only to apply the migration.
- Use the scoped `newturn_app` role for application runtime.
- The initial defect deduction amounts and starting prices are provisional. Replace them with the approved valuation workbook before launch.
- Customer account creation and phone OTP remain a later integration; the current selling flow can save incomplete applications and submit sale requests without OTP.
