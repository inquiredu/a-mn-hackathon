// Pictures of the starters, for their cards on Starters and the tiles on Home: each of the six as it looks just after
// its first main action, and, for the two Apps Scripts, the Sheet each one makes (drawn in scripts/starter-shots/,
// with made-up rows). Writes assets/starters/<name>.webp at 960 by 600: the Play window's width, so each starter
// shows its wide layout (at 800 and narrower some switch to their phone layout). The two spreadsheets are shot
// zoomed in, so their rows read at the size the pictures are shown.
// node scripts/starter-shots.js      (CHROME=/path/to/chrome when Chrome isn't at its macOS path)
// Run it again whenever a starter's look changes, and commit the pictures with the change. Like the design audit's
// tools, it starts its own copy of scripts/serve.js on port 4179 and its own headless Chrome.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { launch, Tab, sleep } = require("./design-audit/cdp.js");

const REPO = path.resolve(__dirname, "..");
const OUT = path.join(REPO, "assets", "starters");
const BASE = "http://localhost:4179/";

// The first press for each, the same moves the design audit makes (scripts/design-audit/capture.js)
const SHOTS = [
  { name: "meeting-timer", page: "cabinets/meeting-timer.html", act: `document.getElementById("start").click()` },
  { name: "group-maker", page: "cabinets/group-maker.html", act: `document.getElementById("again").click()` },
  { name: "feedback-builder", page: "cabinets/feedback-builder.html", act: `document.querySelectorAll("input[type=radio], button[data-level], .level button").forEach((x, i) => { if (i % 3 === 1) x.click(); })` },
  { name: "oracle", page: "cabinets/oracle.html", wait: 4500, act: `(() => { const q = document.querySelector("input, textarea"); q.value = "Will the copier work on Monday?"; q.dispatchEvent(new Event("input", { bubbles: true })); document.getElementById("go").click(); })()` },
  { name: "charter-cards", page: "cabinets/charter-cards.html", act: `document.querySelectorAll(".card")[1].click()` },
  { name: "syllabus-page", page: "cabinets/syllabus-page.html", act: `document.querySelectorAll(".units button")[1].click()` },
  { name: "drive-inventory", page: "scripts/starter-shots/drive-inventory.html", zoom: 960 / 560 },
  { name: "doc-multiplier", page: "scripts/starter-shots/doc-multiplier.html", zoom: 960 / 560 }
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = spawn(process.execPath, [path.join(REPO, "scripts/serve.js")], { env: { ...process.env, PORT: "4179" }, stdio: "ignore" });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "starter-shots-"));
  let chrome;
  try {
    chrome = (await launch(profile)).proc;
    for (let i = 0; i < 80; i++) { try { if ((await fetch(BASE + "index.html")).ok) break; } catch {} await sleep(250); }   // the server is up
    const tab = await Tab.open();
    for (const shot of SHOTS) {
      const zoom = shot.zoom || 1;
      await tab.viewport(Math.round(960 / zoom), Math.round(600 / zoom), { dpr: zoom, theme: "light" });
      await tab.go(BASE + shot.page, 900);
      if (shot.act) await tab.eval(shot.act + "; true");
      await sleep(shot.wait || 1200);
      await tab.eval(`window.scrollTo({ top: 0, behavior: "instant" }); true`);
      const file = await tab.shot(path.join(OUT, shot.name + ".webp"), null, { format: "webp", quality: 82 });
      console.log(path.relative(REPO, file), Math.round(fs.statSync(file).size / 1024) + " KB");
    }
  } finally {
    if (chrome) chrome.kill();
    server.kill();
    fs.rmSync(profile, { recursive: true, force: true });
  }
})();
