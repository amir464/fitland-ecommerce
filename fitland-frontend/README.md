# FitLand Store

FitLand Store is a Vite, React, and TypeScript frontend. Local development uses
the independent FitLand mock API in the sibling `fitland-mock-api` project.

## Local development

Copy `.env.example` to `.env.local` before starting the frontend:

```bash
cp .env.example .env.local
```

Development requires two terminals.

### Terminal 1 — Mock API

```bash
cd ../fitland-mock-api
npm run dev
```

### Terminal 2 — Frontend

```bash
cd ../vite-project
npm run dev
```

- Frontend: http://localhost:5173
- Mock API: http://localhost:4000

The frontend validates `VITE_API_BASE_URL` at startup and does not use a fallback
when it is missing or invalid.
