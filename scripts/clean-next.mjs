import { rmSync } from "fs";
import { join } from "path";

const nextDir = join(process.cwd(), ".next");
try {
  rmSync(nextDir, { recursive: true, force: true });
  console.log("Removed .next — run npm run dev");
} catch (err) {
  console.error("Could not remove .next:", err.message);
  console.error("Stop all npm run dev terminals, then try again.");
  process.exit(1);
}
