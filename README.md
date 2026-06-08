# Live Graduation Speech Companion

A synchronized ceremony experience: multilingual captions on phones, a cinematic tree visual on the projector, and a calm speaker dashboard to advance the speech in real time.

## Routes

| Route | Purpose |
|-------|---------|
| `/` | QR landing — links to all surfaces |
| `/s/[sessionId]` | Audience — captions, reflection, language |
| `/speaker/[sessionId]` | Speaker — next/prev, reflection, reset |
| `/projector/[sessionId]` | Projector — full-screen tree visual |
| `/admin/[sessionId]` | Monitor live state and connections |

Default demo session: **`demo`**

## Quick start

See **[START.md](./START.md)** for ceremony night instructions.

```bash
npm install
npm run dev:clean
```

If you see `ENOENT` for `.next/server/...` or port conflicts, **stop every** `npm run dev` terminal, then:

```bash
npm run dev:clean
```

Use only **one** dev server at http://localhost:3000.

Open [http://localhost:3000](http://localhost:3000).

**Ceremony setup (three devices):**

1. **Projector** → `/projector/demo` (fullscreen, F11)
2. **Speaker laptop** → `/speaker/demo`
3. **Audience QR** → `/s/demo` (or `/` → Join)

## Speaker controls

- **Next / Previous** — advance prewritten sections (captions + visuals sync)
- **Reflection moment** — audience sees private prompts; projector blooms
- **Release audience** — return to captions + “look up” section
- **End session** / **Emergency reset**

Optional: set `SPEAKER_SECRET` in `.env` and enter it on the speaker page so only you can emit control events.

## Realtime sync

- Server-Sent Events (`/api/session/[id]/stream`) broadcast live state
- In-memory store (single Node process) — ideal for one ceremony server
- Reconnect + polling fallback if SSE drops
- Projector animations run **locally** in the browser; state only selects which visual mode to show

For production at scale, swap `src/lib/session-store.ts` with Supabase Realtime + Postgres using the schema in the product spec.

## Content

Edit speech sections and translations in:

`src/lib/seed-session.ts`

Each section includes:

- `speakerText` (reference for the speaker dashboard)
- `translations` for `en`, `fr`, `ar`
- `projectorState` and `audienceState`

**Recommendation:** use prewritten segments, not live speech-to-text, for ceremony reliability.

## Accessibility

- High contrast toggle (audience)
- Large text toggle (audience)
- `prefers-reduced-motion` respected on projector visuals
- RTL layout for Arabic

## Privacy

- No public feeds or profiles
- Reflection answers stored server-side per device session ID (localStorage)
- Responses are private by default

## Build

```bash
npm run build
npm start
```

Deploy to Vercel, a VPS, or any Node host. For a single graduation night, one `npm start` instance on a laptop with stable Wi‑Fi is enough.

## Phase 2 ideas

- Supabase persistence + admin CMS
- Email “future self” for saved reflections
- Offline static caption fallback page
- QR code generator on landing page
