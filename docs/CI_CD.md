# CI/CD Setup

This document describes the continuous integration and deployment setup for Manifestasia.

## GitHub Actions CI Pipeline

The CI pipeline runs on every push and pull request to `main` and `develop` branches.

### Pipeline Stages

1. **Quality Gate** (runs first)
   - **Lint**: ESLint checks code style and catches common issues
   - **Typecheck**: TypeScript validation (`tsc --noEmit`)
   - **Test**: Jest unit tests

2. **Build** (runs after quality passes)
   - **Build**: Next.js production build
   - Validates Supabase public env vars before building, including a live check that the URL accepts the anon/public key, so placeholder or mismatched auth config cannot ship

### Required GitHub Secrets (for build)

If your build fails due to missing Supabase env vars, add these in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL for the target environment |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | The matching Supabase public key for that same project |

### Running CI Locally

Before pushing, run the full CI pipeline locally:

```bash
npm run ci
```

This runs: `lint` → `typecheck` → `test` → `build`

For offline local builds only, set `SKIP_SUPABASE_ONLINE_VALIDATION=1`. Do not use this flag in CI or production deploys.

## Deployment (Vercel)

This project uses [Vercel Analytics](https://vercel.com/analytics). For deployment:

1. **Connect to Vercel**: Link your GitHub repo at [vercel.com/new](https://vercel.com/new)
2. **Environment variables**: Set `NEXT_PUBLIC_SUPABASE_URL` and either `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel project settings. The URL and public key must come from the same Supabase project.
3. **Automatic deploys**: Vercel deploys on every push to `main` (production) and creates preview deployments for PRs

## Branch Protection (Recommended)

To enforce CI before merging:

1. Go to **Settings → Branches → Add rule**
2. Branch name pattern: `main` (and optionally `develop`)
3. Enable: **Require status checks to pass before merging**
4. Select: `quality` and `build` (or `Lint, Typecheck & Test` and `Build`)
5. Enable: **Require branches to be up to date before merging**

## Scaling Considerations

- **Parallel jobs**: Quality and build could run in parallel; currently build depends on quality to fail fast
- **Caching**: `cache: 'npm'` in setup-node speeds up installs
- **Concurrency**: `cancel-in-progress: true` cancels outdated runs when new commits are pushed
