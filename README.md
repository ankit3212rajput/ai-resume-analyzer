# AI Resume Analyzer Pro

A production-ready SaaS starter for AI-powered resume analysis built with Next.js, Tailwind CSS, Express, MongoDB, OpenAI, Stripe, JWT auth, Google OAuth, and Chart.js.

## Structure

- `frontend/` Next.js SaaS frontend
- `backend/` Express API, MongoDB models, OpenAI, Stripe, file parsing

## Run locally

1. Copy `.env.example` values into:
   - `backend/.env` or the project root `.env`
   - `frontend/.env.local` or the project root `.env`
2. Install dependencies:

```bash
npm install
```

3. Start both apps:

```bash
npm run dev
```

## Default local URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Notes

- If `OPENAI_API_KEY` is not configured, the backend falls back to deterministic heuristic responses for local demos.
- Stripe billing routes are fully wired, but require valid Stripe keys and price IDs.
- Google sign-in requires `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
- Update `frontend/public/robots.txt` and `frontend/public/sitemap.xml` with your production domain before deploying.
