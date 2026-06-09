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
  };

  const stream = new ReadableStream({
    async start(controller) {
      ctx.controller = controller;

      // Send current state immediately
      const initial = await getLiveState(id);
      let lastTimestamp = initial.timestamp;
      controller.enqueue(encode(`data: ${JSON.stringify(initial)}\n\n`));

      if (!USE_REDIS) {
        // Local dev: in-process broadcast — instant updates
        registerSse(id, controller);
        ctx.timer = setInterval(() => {
          if (!ctx.active) return;
          try { controller.enqueue(encode(": ping\n\n")); } catch { /* closed */ }
        }, 15_000);
        return;
      }

      // Production (Redis): poll every 4 s and push only when state changed.
      // A lightweight timestamp read is used first; full state is fetched only on change.
      const POLL_MS = 4_000;
      const poll = async () => {
        if (!ctx.active) return;
        try {
          const state = await getLiveState(id);
          if (state.timestamp > lastTimestamp) {
            lastTimestamp = state.timestamp;
            controller.enqueue(encode(`data: ${JSON.stringify(state)}\n\n`));
          } else {
            // heartbeat keeps the connection alive without sending data
            controller.enqueue(encode(": ping\n\n"));
          }
        } catch {
          ctx.active = false;
          return;
        }
        if (ctx.active) ctx.timer = setTimeout(poll, POLL_MS);
      };

      ctx.timer = setTimeout(poll, POLL_MS);
    },

    cancel() {
      ctx.active = false;
      if (ctx.timer) {
        clearTimeout(ctx.timer as ReturnType<typeof setTimeout>);
        clearInterval(ctx.timer as ReturnType<typeof setInterval>);
      }
      if (!USE_REDIS && ctx.controller) {
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
