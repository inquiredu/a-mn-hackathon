// Every check in one go: node scripts/check-all.js
// The session file and every page as the browser reads them, then the stage timer and Oracle tests.
// The git hooks in .githooks run the same three; this is for a clone without them, and for CI.
const { spawnSync } = require("child_process");
const path = require("path");

const checks = ["check-session.js", "test-stage-timer.js", "test-oracle.js"];
let failed = 0;
for (const file of checks) {
  const result = spawnSync(process.execPath, [path.join(__dirname, file)], { stdio: "inherit" });
  if (result.status !== 0) failed++;
}
console.log(failed ? `check-all: ${failed} of ${checks.length} checks failed` : `check-all: all ${checks.length} checks pass`);
process.exit(failed ? 1 : 0);
