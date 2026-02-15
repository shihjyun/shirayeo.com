# shirayeo.com

SvelteKit portfolio site.

## Local development

```sh
npm install
npm run dev
```

## Production build (local check)

```sh
npm run build
npm run preview
```

## Deploy to Vercel

This project uses `@sveltejs/adapter-vercel`.

### Option A: Deploy from Vercel dashboard

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel, click `Add New...` -> `Project`.
3. Import this repository.
4. Framework preset should be detected as `SvelteKit`.
5. Add environment variables from `.env.example` in `Project Settings` -> `Environment Variables`.
6. Click `Deploy`.

### Option B: Deploy with Vercel CLI

```sh
npm i -g vercel
vercel login
vercel
vercel --prod
```

## Environment variables

Copy `.env.example` values into Vercel environment variables.

- `PUBLIC_SITE_TITLE`
- `MEDIA_PROVIDER` (`stub` or `gcs`)
- `MEDIA_PHOTOS_BASE_URL`
- `MEDIA_WORKS_BASE_URL`
- `GCS_PROJECT_ID` (required when `MEDIA_PROVIDER=gcs`)
- `GCS_CLIENT_EMAIL` (required when `MEDIA_PROVIDER=gcs`)
- `GCS_PRIVATE_KEY` (required when `MEDIA_PROVIDER=gcs`)
- `GCS_BUCKET_NAME` (required when `MEDIA_PROVIDER=gcs`)
- `GCS_OBJECT_PREFIX` (optional when `MEDIA_PROVIDER=gcs`)

## Important note for `/admin`

`/admin` is currently restricted to `localhost` only (`src/lib/server/admin-auth.ts`).
After deploying to Vercel, public requests to `/admin` will return `403` unless this logic is changed.
