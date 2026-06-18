## Database Migrations & Environments

This project uses **Supabase** for the database and **GitHub Actions** to automatically apply migrations when changes are merged into the main branches.

### Environments

We follow a Git Flow with three main branches:

- `dev` – development environment
- `stage` – staging / UAT environment
- `main` – production environment

Each branch is connected to its corresponding Supabase project (or environment).

### How migrations are created

Migrations live in the `supabase/migrations/` directory.

Typical workflow:

1. Create or modify database schema locally using the Supabase CLI or SQL editor.
2. Generate a new migration locally (for example with `supabase migration new <name>` or by exporting changes).
3. Commit the migration SQL files to the repo.
4. Open a pull request from your feature branch into `dev`.

### How migrations are applied (CI)

Migrations are applied automatically by a GitHub Actions workflow:

- On **every push/merge to `dev`**:
  - The `supabase-migrations` workflow runs.
  - It links to the **Supabase dev project** and runs:
    - `supabase db push --include-all --password <DEV_DB_PASSWORD>`
  - All pending migrations in `supabase/migrations/` are applied to the **dev** database.

- On **every push/merge to `stage`**:
  - The same workflow links to the **Supabase stage project** and runs:
    - `supabase db push --include-all --password <STAGE_DB_PASSWORD>`
  - All pending migrations are applied to the **stage** database.

- On **every push/merge to `main`**:
  - The workflow links to the **Supabase prod project** and runs:
    - `supabase db push --include-all --password <PROD_DB_PASSWORD>`
  - All pending migrations are applied to the **production** database.

The workflow uses the following GitHub Secrets (configured in the repo settings):

- `SUPABASE_ACCESS_TOKEN` – user access token for the Supabase CLI
- `SUPABASE_PROJECT_REF_DEV` / `SUPABASE_PROJECT_REF_STAGE` / `SUPABASE_PROJECT_REF_PROD`
- `SUPABASE_DB_PASSWORD_DEV` / `SUPABASE_DB_PASSWORD_STAGE` / `SUPABASE_DB_PASSWORD_PROD`

### Important notes

- **Do not edit the Supabase schema directly in the dashboard for shared environments** (dev/stage/prod). Always go through migrations so that all environments stay in sync.
- Migrations are **applied in order** based on their timestamped filenames. Avoid manually reordering or deleting existing migration files once they have been applied.
- If a migration fails in CI for a given branch, fix the migration in a new commit and let the workflow re-run on that branch.
-  <!-- Updated environment variables -->
-  


