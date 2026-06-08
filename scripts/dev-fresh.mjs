import { execSync } from "child_process";
import { rmSync } from "fs";
import { join } from "path";

const root = process.cwd();
const nextDir = join(root, ".next");

function killPort3000() {
  if (process.platform !== "win32") return;
  try {
    const out = execSync(
      'netstat -ano | findstr ":3000" | findstr LISTENING',
      { encoding: "utf8" }
    );
    const pids = new Set();
    for (const line of out.split("\n")) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid)) pids.add(pid);
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
        console.log(`Stopped process ${pid} on port 3000`);
      } catch {
        /* already gone */
      }
    }
  } catch {
    /* port free */
  }
}

killPort3000();
try {
  rmSync(nextDir, { recursive: true, force: true });
  console.log("Removed .next");
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

console.log("Starting dev server on http://localhost:3000 ...");
execSync("npx next dev -p 3000", { stdio: "inherit", cwd: root });
