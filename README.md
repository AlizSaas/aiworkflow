# FlowRiz

FlowRiz is a workflow automation app built with Next.js. Users can sign in, create visual workflows, trigger them manually or by webhook, execute HTTP request steps, store credentials, and inspect execution logs.

## Stack

- Next.js 15 + React 19
- tRPC 11
- Prisma + PostgreSQL
- Better Auth
- Inngest
- Tailwind CSS + Radix UI
- Sentry

## Main Features

- Visual workflow editor
- Workflow list and detail pages
- Manual and webhook workflow triggers
- HTTP request execution node
- Credential storage
- Execution history and per-node logs
- Subscription gating for workflow creation through Polar

## API Endpoints

- `GET/POST /api/auth/[...all]` — authentication
- `GET/POST /api/trpc/[trpc]` — tRPC procedures for workflows, executions, credentials, and webhooks
- `GET/POST/PUT /api/inngest` — Inngest dev/serve endpoint
- `POST /api/webhook/[webhookId]` — webhook trigger endpoint with optional `x-webhook-signature`

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required for local development:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `POLAR_ACCESS_TOKEN`
- `POLAR_SUCCESS_URL`

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your env file:

   ```bash
   cp .env.example .env
   ```

3. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the Next.js app:

   ```bash
   npm run dev
   ```

6. In a second terminal, start Inngest locally:

   ```bash
   npm run inngest:dev
   ```

7. Open `http://localhost:3000`.

## VS Code Checklist

- Node.js 20+
- npm 10+
- PostgreSQL running locally or a hosted PostgreSQL database
- A `.env` file created from `.env.example`
- Two terminals:
  - `npm run dev`
  - `npm run inngest:dev`

## Validation Run In This Repo

- `npm install` ✅
- `npm run lint` ✅ after ignoring generated Prisma output
- `npx tsc --noEmit` ✅ after restoring Next.js type declarations
- `npm run build` ✅ after removing remote Google font dependency

## Notes

- The checked-in README was placeholder boilerplate before this update.
- There is no automated test suite in `package.json` yet, so lint, typecheck, and production build are the available validation steps.
