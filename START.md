# Ceremony — quick start

## One-time setup

```powershell
cd C:\Users\Admin\Desktop\Graduation
npm install
```

## Every time you develop

1. **Close all** other `npm run dev` terminals.
2. Run:

```powershell
npm run dev:clean
```

3. Open **only** these URLs:

| Role | URL |
|------|-----|
| Speaker | http://localhost:3000/speaker/demo |
| Projector | http://localhost:3000/projector/demo (fullscreen F11) |
| Audience phones | http://localhost:3000/s/demo |

## Ceremony flow

1. Speaker: click **▶ Start — show QR on projector**
2. Audience scans QR (auto URL from your Wi‑Fi IP in production)
3. Speaker: **Next** through sections
4. Speaker: **QR + reflection moment** → phones show questions automatically
5. Audience answers → leaf + chime on projector
6. Jump to **Look up — seasons** for season color animation

## If you see ENOENT or 500 errors

```powershell
npm run dev:clean
```

Do not run multiple dev servers. Port is fixed to **3000**.
