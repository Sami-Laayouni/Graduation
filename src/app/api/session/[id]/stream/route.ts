import { getLiveState, registerSse, unregisterSse } from "@/lib/session-store";
import { USE_REDIS } from "@/lib/kv";
import { getSessionById } from "@/lib/seed-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Maximum function lifetime on Vercel Pro (seconds).
 * On Hobby the cap is 10 s regardless — the client reconnects within 3 s.
 */
export const maxDuration = 300;

const enc = new TextEncoder();
const encode = (s: string) => enc.encode(s);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getSessionById(id)) {
    return new Response("Session not found", { status: 404 });
  }

  // Shared mutable context accessible by both start() and cancel()
  const ctx = {
    active: true,
    controller: null as ReadableStreamDefaultController | null,
    timer: null as ReturnType<typeof setTimeout> | ReturnType<typeof setInterval> | null,
    heartbeat: null as ReturnType<typeof setInterval> | null,
  };

  const stream = new ReadableStream({
    async start(controller) {
      ctx.controller = controller;

      // Send current state immediately, then keep watching for changes.
      const initial = await getLiveState(id);
      let lastTimestamp = initial.timestamp;
      controller.enqueue(encode(`data: ${JSON.stringify(initial)}\n\n`));

      // Always register for in-process push (instant on local dev / warm instances)
      registerSse(id, controller);

      ctx.heartbeat = setInterval(() => {
        if (!ctx.active) return;
        try { controller.enqueue(encode(": ping\n\n")); } catch { /* closed */ }
      }, 15_000);

      if (!USE_REDIS) {
        ctx.timer = ctx.heartbeat;
        return;
      }

      // Production (Redis): poll frequently and push only when state changed.
      const POLL_MS = 200;
      const poll = async () => {
        if (!ctx.active) return;
        try {
          const state = await getLiveState(id);
          if (state.timestamp > lastTimestamp) {
            lastTimestamp = state.timestamp;
            controller.enqueue(encode(`data: ${JSON.stringify(state)}\n\n`));
          }
        } catch {
          ctx.active = false;
          return;
        }
        if (ctx.active) ctx.timer = setTimeout(poll, POLL_MS);
      };

      ctx.timer = setTimeout(poll, 25);
    },

    cancel() {
      ctx.active = false;
      if (ctx.timer) {
        clearTimeout(ctx.timer as ReturnType<typeof setTimeout>);
        clearInterval(ctx.timer as ReturnType<typeof setInterval>);
      }
      if (ctx.heartbeat && ctx.heartbeat !== ctx.timer) {
        clearInterval(ctx.heartbeat);
      }
      if (ctx.controller) {
        unregisterSse(id, ctx.controller);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
