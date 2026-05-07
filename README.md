# Lead Capture — Secco Squared Take-Home

A lead capture web app built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase. Visitors can submit a lead form; submissions are persisted in Supabase and forwarded to a webhook endpoint server-side.

**Live app:** _coming soon (Vercel URL here after deployment)_
**Repo:** [github.com/Arbiter09/Lead-Capture](https://github.com/Arbiter09/Lead-Capture)

---

## Pages

| Route | Description |
|---|---|
| `/` | Lead capture form — validates, saves to Supabase, fires webhook |
| `/leads` | Table of all submitted leads, sorted most recent first |

---

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier is fine)
- A Vercel account for deployment

---

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/Arbiter09/Lead-Capture.git
cd Lead-Capture
npm install
```

### 2. Create the Supabase table

In your Supabase project, open the SQL Editor and run:

```sql
CREATE TABLE leads (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   TEXT        NOT NULL,
  email       TEXT        NOT NULL UNIQUE,
  company     TEXT,
  source      TEXT        NOT NULL CHECK (source IN ('Google','Referral','Social','Other')),
  message     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS with no policies:
-- anonymous clients using the anon key get zero access (read or write).
-- The app uses the service_role key server-side, which bypasses RLS entirely.
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
```

### 3. Set environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Where to find it | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role key | Yes |
| `WEBHOOK_URL` | Provided by Secco Squared — `https://webhook-receiver-flax.vercel.app/api/lead-webhook` | Yes |

> **Security note:** `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the browser. It's only used in server-side code (API route, Server Components) and is never prefixed with `NEXT_PUBLIC_`.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How It Works

### Form submission flow

1. User fills out the form and hits **Submit**.
2. Client-side Zod validation fires immediately — field errors shown inline if invalid.
3. Valid data is `POST`ed to `/api/leads`.
4. The API route validates again server-side (Zod), then inserts the lead into Supabase using the service role key.
5. After a successful insert, `waitUntil(fireWebhook(...))` registers the webhook dispatch as a background task — the HTTP response is returned to the client immediately without waiting for the webhook.
6. The form shows a success state. The lead appears on `/leads`.

### Webhook error handling

The `fireWebhook` function catches two failure modes:
- **Network error** — the fetch itself throws (timeout, DNS failure, etc.)
- **Non-2xx response** — the webhook endpoint returns a 4xx/5xx

Both are logged via `console.error` with a `[webhook]` prefix, visible in Vercel's Function Logs tab. A webhook failure never blocks or degrades the user-facing submission.

`waitUntil` from `@vercel/functions` is used instead of a bare unawited promise — in Vercel serverless, the runtime can freeze the function immediately after the response is returned, silently dropping any floating promises. `waitUntil` tells the runtime to keep the function alive until the background task completes.

### RLS setup

The `leads` table has RLS enabled with **no policies**. This means:
- Any client using the anonymous/public Supabase key gets zero access (no reads, no writes).
- The API route and the `/leads` Server Component use the `service_role` key, which bypasses RLS entirely and is never sent to the browser.

---

## Deployment (Vercel)

1. Push to GitHub (already done).
2. Import the repo at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects Next.js.
3. Add the three environment variables in the Vercel dashboard under **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `WEBHOOK_URL`
4. Deploy. Vercel assigns a `*.vercel.app` URL.
5. Submit a test lead and verify it appears on `/leads` and in the Supabase table.
6. Confirm webhook delivery: **Vercel dashboard → Functions → Logs** — no `[webhook]` error lines should appear.

---

## Project Structure

```
lead-capture/
├── app/
│   ├── layout.tsx              # Root layout — header nav, footer
│   ├── page.tsx                # "/" — lead capture form
│   ├── globals.css
│   ├── leads/
│   │   └── page.tsx            # "/leads" — server component, leads table
│   └── api/
│       └── leads/
│           └── route.ts        # POST /api/leads
├── components/
│   ├── LeadForm.tsx            # Client component — four-state form machine
│   ├── FormField.tsx           # Reusable accessible field wrapper
│   └── LeadsTable.tsx          # Table with empty state and mobile scroll
├── lib/
│   ├── validations.ts          # Zod schema — shared by client and server
│   ├── supabase-server.ts      # Server-only Supabase client (service_role)
│   └── types.ts                # Lead type
└── .env.local.example
```

---

## Decisions & Trade-offs

**Zod on both client and server** — one schema in `lib/validations.ts` is imported by `LeadForm.tsx` (client validation before fetch) and `route.ts` (server re-validation). No duplication, single source of truth for field rules.

**`waitUntil` over fire-and-forget** — a bare unawaited `fetch().catch()` after `return NextResponse.json()` is unreliable in Vercel serverless: the runtime freezes the function as soon as the response is sent, often before the promise has resolved. `waitUntil` from `@vercel/functions` is the documented solution — it registers the task with the runtime so it completes even after the response is returned.

**No auth on `/leads`** — the brief explicitly says no auth needed. The `/leads` page is a Next.js Server Component that queries Supabase with the service role key entirely server-side; the key never reaches the browser, and the RLS setup means the table is inaccessible via any client-side Supabase call.

**`WEBHOOK_URL` as env var, `X-Candidate-Name` hardcoded** — the URL could differ between environments (e.g. a mock during local dev), so it belongs in config. The candidate name is a true constant that must always be `Jas Shah` — making it an env var risks a misconfigured or empty header silently breaking submission identification.

**What I'd add with more time:**
- Auth on `/leads` (simple password or magic link via Supabase Auth)
- Pagination on the leads table
- Webhook retry with exponential backoff
- Rate limiting on `POST /api/leads` (e.g. Upstash Redis + `@upstash/ratelimit`)
- E2E tests with Playwright
