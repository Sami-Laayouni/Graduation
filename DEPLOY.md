# Deploying to Vercel

## 1. Push to GitHub

```bash
git add .
git commit -m "production-ready: Redis KV + async store"
git push
```

## 2. Create a Vercel project

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Leave build/output settings as-is

## 3. Create a KV (Redis) store

1. In your Vercel project → **Storage** tab → **Create Database → KV**
2. Name it anything (e.g. `graduation-kv`)
3. Click **Connect to Project** — Vercel automatically injects:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

> **Alternative (Upstash):** Create a free Redis database at [upstash.com](https://upstash.com),
> then set `KV_REST_API_URL` and `KV_REST_API_TOKEN` manually.

## 4. Add environment variables

In your Vercel project → **Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `SPEAKER_SECRET` | A strong random secret (e.g. `openssl rand -hex 32`) |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` (your actual URL) |
| `NEXT_PUBLIC_DEFAULT_SESSION` | `demo` |

> `KV_REST_API_URL` and `KV_REST_API_TOKEN` are injected automatically from step 3.

## 5. Deploy

Click **Deploy** (or push a commit). Vercel builds and deploys in ~1 min.

## 6. Ceremony day checklist

- [ ] Open `/projector/demo` on the big screen
- [ ] Open `/speaker/demo` on your phone/laptop (enter the `SPEAKER_SECRET`)
- [ ] Test: advance a section, confirm projector updates
- [ ] Share `https://your-app.vercel.app/s/demo` as the audience QR target
- [ ] (Optional) Delete any test leaves via speaker panel before the real ceremony

## How syncing works on Vercel

- Every speaker event (`/api/session/[id]/event`) writes new state to Redis
- The SSE stream at `/api/session/[id]/stream` polls Redis every **1.5 s** and pushes updates to connected clients
- Each client also polls `/state` every **5 s** as a guaranteed fallback
- If the SSE connection drops (Vercel timeout), clients reconnect within 3 s and get the latest state from Redis immediately

## Local development (no Redis needed)

```bash
npm run dev
```

Without `KV_REST_API_URL` set, the app uses in-memory storage — everything works exactly as before for local testing.

To test with Redis locally, create `.env.local`:

```
KV_REST_API_URL=https://your-kv-url.upstash.io
KV_REST_API_TOKEN=your-token-here
SPEAKER_SECRET=dev-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_SESSION=demo
```
