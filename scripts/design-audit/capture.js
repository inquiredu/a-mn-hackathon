// Captures every surface of First Builds for the design audit.
// node scripts/design-audit/capture.js <repo> <outDir> [only]   (only: a comma list of job names:
// pages, states, sourcesfix, stage, timerfix, notes, notesfix, cabinets, motion)
// Starts its own copy of scripts/serve.js on port 4179 and its own headless Chrome, so nothing is shared
// with the user's browser or another chat's server.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { launch, Tab, sleep } = require("./cdp.js");

const REPO = path.resolve(process.argv[2]);
const OUT = path.resolve(process.argv[3]);
const ONLY = process.argv[4] ? process.argv[4].split(",") : null;
const BASE = "http://localhost:4179/";
const manifest = [];   // { file, surface, state, width, theme, note }

const W = { phone: { w: 375, h: 812, dpr: 2, mobile: false }, desk: { w: 1280, h: 800, dpr: 1, mobile: false } };

function rec(file, meta) { manifest.push({ file: path.relative(OUT, file), ...meta }); return file; }

// Scroll through the page a viewport at a time, the way a reader would, with a little overlap
async function slices(tab, dir, base, meta, { max = 30 } = {}) {
  const { total, vh } = await tab.eval("({ total: document.documentElement.scrollHeight, vh: visualViewport.height })");
  const step = Math.round(vh * 0.86);
  const files = [];
  let n = 0;
  for (let y = 0; n < max; y += step) {
    const top = Math.min(y, Math.max(0, total - vh));
    await tab.eval(`window.scrollTo({ top: ${top}, behavior: "instant" }); true`);
    await sleep(160);
    n++;
    const file = path.join(dir, `${base}-s${String(n).padStart(2, "0")}.png`);
    await tab.shot(file);
    files.push(rec(file, { ...meta, slice: n, scrollY: top, pageHeight: total }));
    if (top >= total - vh) break;
  }
  await tab.eval(`window.scrollTo({ top: 0, behavior: "instant" }); true`);
  return files;
}

async function setup(tab, size, theme) {
  const v = W[size];
  await tab.viewport(v.w, v.h, { dpr: v.dpr, mobile: v.mobile, theme });
  if (size === "phone") await tab.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
}

async function fontsOk(tab) {
  return tab.eval(`({ montserrat: document.fonts.check('600 16px Montserrat'), newsreader: document.fonts.check('400 16px Newsreader') })`);
}

// Frames over a short window after an action, for motion review: screenshots in a tight loop, each stamped
// with its time since the action (a capture takes 30-80 ms, so this samples, it doesn't film)
async function frames(tab, file, action, { ms = 900, keep = 8, meta = {} } = {}) {
  const got = [];
  const t0 = Date.now();
  tab.eval(action).catch((e) => console.warn("  action", e.message.split("\n")[0]));
  while (Date.now() - t0 < ms) {
    const r = await tab.send("Page.captureScreenshot", { format: "jpeg", quality: 75 });
    got.push({ t: Date.now() - t0, data: r.data });
  }
  const pick = got.length <= keep ? got : Array.from({ length: keep }, (_, i) => got[Math.round(i * (got.length - 1) / (keep - 1))]);
  const cells = pick.map((f) => `<figure><img src="data:image/jpeg;base64,${f.data}"><figcaption>+${f.t} ms</figcaption></figure>`).join("");
  const strip = await Tab.open();
  const cols = Math.min(4, pick.length);
  await strip.viewport(cols * 420 + 20, 100, { dpr: 1 });
  await strip.send("Page.setDocumentContent", { frameId: (await strip.send("Page.getFrameTree")).frameTree.frame.id,
    html: `<style>body{margin:10px;font:13px system-ui;background:#fff}div{display:grid;grid-template-columns:repeat(${cols},410px);gap:10px}img{width:410px;border:1px solid #999;display:block}figure{margin:0}figcaption{padding:2px 0}</style><div>${cells}</div>` });
  await sleep(300);
  const h = await strip.eval("document.body.scrollHeight + 20");
  await strip.viewport(cols * 420 + 20, h, { dpr: 1 });
  await sleep(100);
  await strip.shot(file);
  await strip.close();
  rec(file, { ...meta, kind: "motion", frames: pick.length, captured: got.length, windowMs: ms });
  return file;
}

// Crop an element (with some room around it) from the current viewport
async function crop(tab, selector, file, meta, pad = 16) {
  const box = await tab.eval(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); if (!e) return null;
    e.scrollIntoView({ block: "center", behavior: "instant" }); const r = e.getBoundingClientRect();
    return { x: Math.max(0, r.left - ${pad}), y: Math.max(0, r.top - ${pad}), width: Math.min(innerWidth, r.width + ${pad * 2}), height: Math.min(innerHeight, r.height + ${pad * 2}) }; })()`);
  if (!box) { console.warn("  no element for", selector); return null; }
  await sleep(120);
  await tab.shot(file, box);
  return rec(file, meta);
}

const PAGES = [
  { id: "home", file: "index.html", states: [
    { state: "after", q: "", note: "Default: any day after the first run (today). The front door." },
    { state: "before", q: "?now=09:30", note: "The morning of the event, before 10:00: the invitation." },
    { state: "during-remix", q: "?now=10:30", note: "During the event: the Remix Arcade part is on." },
    { state: "during-cheer", q: "?now=11:30", note: "During the event: Show & Cheer is on." },
    { state: "during-close", q: "?now=11:52", note: "During the event: the close is on." }
  ] },
  { id: "levels", file: "levels.html", states: [
    { state: "after", q: "", note: "Default (any day)." }, { state: "during", q: "?now=10:12", note: "During the event: the now bar shows." } ] },
  { id: "starters", file: "starters.html", states: [
    { state: "after", q: "", note: "Default (any day)." }, { state: "during", q: "?now=10:30", note: "During the event: the now bar shows." } ] },
  { id: "invent", file: "invent.html", states: [
    { state: "after", q: "", note: "Default (any day)." }, { state: "during", q: "?now=10:50", note: "During the event: the now bar shows." } ] },
  { id: "hosts", file: "hosts.html", states: [
    { state: "after", q: "", note: "Default (any day)." }, { state: "during", q: "?now=10:30", note: "During the event: the now bar shows and the current part's fold opens." } ] },
  { id: "sources", file: "sources.html", states: [
    { state: "after", q: "", note: "Default (any day)." }, { state: "during", q: "?now=10:30", note: "During the event: the now bar shows." } ] }
];

const JOBS = {};

// The stage's presenter controls fade when idle: ROOM shows what the room sees, PRESENTER what the presenter sees after a mouse move
const ROOM = `document.body.classList.remove("chrome-on"); document.getAnimations().forEach((a) => a.finish()); true`;
const PRESENTER = `document.body.classList.add("chrome-on"); document.getAnimations().forEach((a) => a.finish()); true`;

// 1. Every page, every state, both widths, both themes, scrolled top to bottom
JOBS.pages = async (tab) => {
  for (const page of PAGES) {
    for (const st of page.states) {
      const fullStates = st.state === "after" || st.state === "before" || st.state === "during-remix" || page.id !== "home";
      for (const theme of ["light", "dark"]) {
        for (const size of ["phone", "desk"]) {
          // Non-default "during" states on pages other than Home: the top two slices are enough to show the now bar
          const max = (page.id !== "home" && st.state === "during") ? 1 : (!fullStates ? 30 : 30);
          await setup(tab, size, theme);
          await tab.go(BASE + page.file + st.q);
          const dir = path.join(OUT, page.id);
          await slices(tab, dir, `${st.state}-${W[size].w}-${theme}`, { surface: page.id, state: st.state, width: W[size].w, theme, note: st.note }, { max });
        }
      }
      console.log("  ", page.id, st.state);
    }
  }
};

// 2. Interaction states on the site pages: menus, dialogs, panels, toasts, empty states
JOBS.states = async (tab) => {
  const S = path.join(OUT, "states");
  const grant = await tab.send("Browser.grantPermissions", { origin: BASE.slice(0, -1), permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"] }).catch((e) => console.warn("grant", e.message));
  for (const theme of ["light", "dark"]) {
    for (const size of ["phone", "desk"]) {
      const w = W[size].w;
      const tag = `${w}-${theme}`;
      const m = (surface, state, note) => ({ surface, state, width: w, theme, note });
      await setup(tab, size, theme);

      // Starters: remix menu open
      await tab.go(BASE + "starters.html");
      await tab.eval(`document.querySelector("details.remix").open = true; document.querySelector("details.remix").scrollIntoView({ block: "start", behavior: "instant" }); scrollBy(0, -90); true`);
      await sleep(250);
      await tab.shot(path.join(S, `starters-remix-open-${tag}.png`)); rec(path.join(S, `starters-remix-open-${tag}.png`), m("starters", "remix menu open", "The first starter's Remix menu, opened."));
      // Starters: Copy for my AI, then the next-step panel
      await tab.eval(`document.querySelector("[data-copy-machine]").scrollIntoView({ block: "center", behavior: "instant" }); document.querySelector("[data-copy-machine]").click(); true`);
      await sleep(900);
      await tab.shot(path.join(S, `starters-next-step-${tag}.png`)); rec(path.join(S, `starters-next-step-${tag}.png`), m("starters", "next-step panel", "After pressing Copy for my AI on the Meeting Timer: the panel that offers the AI tools."));
      // Starters: a remix line's Copy, then the toast
      await tab.go(BASE + "starters.html");
      await tab.eval(`const d = document.querySelector("details.remix"); d.open = true; d.querySelector("li button").scrollIntoView({ block: "center", behavior: "instant" }); d.querySelector("li button").click(); true`);
      await sleep(700);
      await tab.shot(path.join(S, `starters-toast-${tag}.png`)); rec(path.join(S, `starters-toast-${tag}.png`), m("starters", "toast", "After pressing Copy beside a remix line: the confirmation message."));
      // Starters: the copy-by-hand fallback dialog
      await tab.eval(`copyByHand("Here is the code for a small web app called \\"The Meeting Timer\\". Please run it as a live preview..."); true`);
      await sleep(400);
      await tab.shot(path.join(S, `fallback-dialog-${tag}.png`)); rec(path.join(S, `fallback-dialog-${tag}.png`), m("starters", "copy-by-hand dialog", "Shown when the browser blocks copying. Same dialog on every page."));
      await tab.eval(`document.getElementById("fallback").close(); true`);

      // Play window, every starter (Meeting Timer also with the code shown)
      for (const id of ["timer", "groups", "feedback", "oracle", "charter", "syllabus"]) {
        await tab.go(BASE + "starters.html");
        await tab.eval(`document.querySelector('[data-play="${id}"]').click(); true`);
        await sleep(1600);
        const f = path.join(S, `play-${id}-${tag}.png`);
        await tab.shot(f); rec(f, m("starters", `Play window: ${id}`, `The Play window (a dialog) open on this starter, running it in a frame.`));
        if (id === "timer" || id === "charter") {
          await tab.eval(`document.getElementById("toggle-code").click(); true`);
          await sleep(500);
          const f2 = path.join(S, `play-${id}-code-${tag}.png`);
          await tab.shot(f2); rec(f2, m("starters", `Play window with code: ${id}`, "After pressing Show the code."));
          await tab.eval(`document.getElementById("run").click(); true`);
          await sleep(700);
          const f3 = path.join(S, `play-${id}-run-toast-${tag}.png`);
          await tab.shot(f3); rec(f3, m("starters", `Play window, Run my changes: ${id}`, "After pressing Run my changes: the message inside the window."));
        }
      }

      // Three levels: the folds open
      await tab.go(BASE + "levels.html");
      await tab.eval(`document.querySelectorAll("details").forEach((d) => d.open = true); true`);
      await sleep(300);
      await slices(tab, S, `levels-folds-open-${tag}`, m("levels", "every fold open", "Three levels with every Read the prompt / Read the script fold opened."), { max: 30 });

      // Invent your own: Copy with an empty field; the builder filled in, then copied; an idea from the jar
      await tab.go(BASE + "invent.html");
      await tab.eval(`document.getElementById("idea-what").scrollIntoView({ block: "center", behavior: "instant" }); document.getElementById("idea-copy").click(); true`);
      await sleep(700);
      await tab.shot(path.join(S, `invent-empty-copy-${tag}.png`)); rec(path.join(S, `invent-empty-copy-${tag}.png`), m("invent", "builder: copy with nothing filled in", "Pressing the builder's copy button with the three answers empty."));
      await tab.eval(`[["idea-what","a hall pass tracker"],["idea-who","my seventh graders"],["idea-does","show who is out of the room and for how long"]].forEach(([id,v]) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event("input")); }); document.getElementById("idea-out").scrollIntoView({ block: "center", behavior: "instant" }); true`);
      await sleep(300);
      await tab.shot(path.join(S, `invent-builder-filled-${tag}.png`)); rec(path.join(S, `invent-builder-filled-${tag}.png`), m("invent", "builder filled in", "The builder with three answers typed: the request takes shape below them."));
      await tab.eval(`document.getElementById("idea-copy").click(); true`);
      await sleep(900);
      await tab.shot(path.join(S, `invent-copied-next-step-${tag}.png`)); rec(path.join(S, `invent-copied-next-step-${tag}.png`), m("invent", "builder copied", "After copying the filled builder: the button's done state and the next-step panel."));
      await tab.go(BASE + "invent.html");
      await tab.eval(`const b = document.querySelector("[data-idea]"); b.scrollIntoView({ block: "center", behavior: "instant" }); b.click(); true`);
      await sleep(900);
      await tab.shot(path.join(S, `invent-jar-fills-${tag}.png`)); rec(path.join(S, `invent-jar-fills-${tag}.png`), m("invent", "an idea from the jar", "After pressing an idea in the jar: it fills the builder's three answers."));

      // Sources: a path, a topic filter, a search with nothing found
      await tab.go(BASE + "sources.html?path=leaders");
      await tab.shot(path.join(S, `sources-path-${tag}.png`)); rec(path.join(S, `sources-path-${tag}.png`), m("sources", "a start-here path chosen", "?path=leaders"));
      // Sources' filter and empty states: see JOBS.sourcesfix

      // Hosts: every fold open
      await tab.go(BASE + "hosts.html");
      await tab.eval(`document.querySelectorAll("details").forEach((d) => d.open = true); true`);
      await sleep(300);
      await slices(tab, S, `hosts-folds-open-${tag}`, m("hosts", "every fold open", "Hosts with every fold opened (run of show, the first run's record)."), { max: 40 });

      // Home during the event: the notice that slides in when the part changes
      await tab.go(BASE + "index.html?now=10:30");
      await tab.eval(`showCue(segments[4]); true`);
      await sleep(500);
      await tab.shot(path.join(S, `home-cue-${tag}.png`)); rec(path.join(S, `home-cue-${tag}.png`), m("home", "the part-changed notice", "During the event, when the clock moves to the next part while the page is open, this notice appears under the now bar."));

      // Header menu at the top of every page: the current page marked
      for (const p of ["levels", "starters", "invent", "hosts", "sources"]) {
        await tab.go(BASE + p + ".html");
        const f = path.join(S, `header-${p}-${tag}.png`);
        await tab.shot(f, { x: 0, y: 0, width: w, height: 160 }); rec(f, m(p, "header", "The top of the page: the site header with this page marked."));
      }
      console.log("  states", tag);
    }
  }
};

// 2b. Sources' filter and empty states, scrolled to the results (on a phone the search sits in a folded panel)
JOBS.sourcesfix = async (tab) => {
  const S = path.join(OUT, "states");
  for (const theme of ["light", "dark"]) {
    for (const size of ["phone", "desk"]) {
      const w = W[size].w, tag = `${w}-${theme}`;
      const m = (state, note) => ({ surface: "sources", state, width: w, theme, note });
      await setup(tab, size, theme);
      await tab.go(BASE + "sources.html?ask=privacy");
      await tab.eval(`(document.querySelector(".results-bar") || document.body).scrollIntoView({ block: "start", behavior: "instant" }); scrollBy(0, -120); true`);
      await sleep(250);
      let f = path.join(S, `sources-filter-${tag}.png`); await tab.shot(f); rec(f, m("a topic filter on", "?ask=privacy, scrolled to the results."));
      await tab.go(BASE + "sources.html");
      await tab.eval(`const t = document.querySelector(".finder-toggle"); if (t && getComputedStyle(t).display !== "none") t.click(); true`);
      await sleep(250);
      f = path.join(S, `sources-finder-open-${tag}.png`);
      await tab.eval(`document.querySelector(".finder").scrollIntoView({ block: "start", behavior: "instant" }); scrollBy(0, -20); true`); await sleep(200);
      await tab.shot(f); rec(f, m("filters panel", size === "phone" ? "On a phone, after pressing the button that shows the filters." : "The filters column beside the sources."));
      await tab.eval(`const q = document.querySelector("#q"); q.value = "zzzz"; q.dispatchEvent(new Event("input", { bubbles: true })); true`);
      await sleep(500);
      await tab.eval(`(document.querySelector(".empty-state:not([hidden])") || document.querySelector(".results-bar")).scrollIntoView({ block: "center", behavior: "instant" }); true`);
      await sleep(250);
      f = path.join(S, `sources-no-results-${tag}.png`); await tab.shot(f); rec(f, m("search finds nothing", "Searching for a word no source has, scrolled to the results."));
    }
  }
};

// 3. The stage: every screen at a shared-tab size and on a phone; the session clock's states
JOBS.stage = async (tab) => {
  const D = path.join(OUT, "stage");
  const count = 21;
  for (const [size, vw, vh, dpr, mobile] of [["1280", 1280, 720, 1, false], ["375", 375, 812, 2, true]]) {
    await tab.viewport(vw, vh, { dpr, mobile, theme: "light" });
    // The stage reads its screen from the address only when it loads, so load it once and move with show(i)
    await tab.go("about:blank", 100);
    await tab.go(BASE + "present.html", 900);
    await tab.eval(`localStorage.clear(); true`);
    for (let i = 0; i < count; i++) {
      await tab.eval(`show(${i}); scrollTo({ top: 0, behavior: "instant" }); true`);
      await sleep(i === 2 ? 2200 : 500);   // the Oracle embed loads in a frame
      await tab.eval(ROOM);   // what the room sees: the presenter's controls faded
      const meta = { surface: "stage", state: `screen ${i + 1} of ${count}`, width: vw, theme: "stage", note: await tab.eval(`(() => { const s = screens[${i}]; return s.kind + " · " + s.segment.title + " · " + (s.heading || s.text || ""); })()`) };
      if (mobile) await slices(tab, D, `screen-${String(i + 1).padStart(2, "0")}-${size}`, meta, { max: 4 });
      else { const f = path.join(D, `screen-${String(i + 1).padStart(2, "0")}-${size}.png`); await tab.shot(f); rec(f, meta); }
    }
    // The presenter's view of three screens: the controls showing, as they do when the mouse moves
    for (const i of [0, 8, 12]) {
      await tab.eval(`show(${i}); scrollTo({ top: 0, behavior: "instant" }); true`); await sleep(500);
      await tab.eval(PRESENTER); await sleep(150);
      const f = path.join(D, `presenter-screen-${String(i + 1).padStart(2, "0")}-${size}.png`); await tab.shot(f);
      rec(f, { surface: "stage", state: `presenter view, screen ${i + 1}`, width: vw, theme: "stage", note: "The same screen with the presenter's controls showing (after a mouse move or a key press); they fade after a few idle seconds." });
    }
    // The clock: called to order (corner), open, a wait running, a screen timer running, over time
    const m = (state, note) => ({ surface: "stage", state, width: vw, theme: "stage", note });
    await tab.go("about:blank", 100);
    await tab.go(BASE + "present.html", 900);
    await tab.eval(PRESENTER);
    let f = path.join(D, `clock-ready-${size}.png`); await tab.shot(f); rec(f, m("clock waiting, presenter view", "Screen 1 before the call to order: the two hours shown large, with Call to order (a presenter control)."));
    await tab.eval(`document.getElementById("sc-start").click(); true`); await sleep(800);
    f = path.join(D, `clock-called-hero-${size}.png`); await tab.shot(f); rec(f, m("clock called, screen 1", "Just after Call to order, still on screen 1."));
    await tab.eval(`show(4); true`); await sleep(1200);
    f = path.join(D, `clock-corner-${size}.png`); await tab.shot(f); rec(f, m("clock in the corner", "Called to order, on a later screen: the clock has moved to the corner of the rail."));
    await tab.eval(`openClock(true); true`); await sleep(900);
    await tab.eval(PRESENTER);
    f = path.join(D, `clock-open-${size}.png`); await tab.shot(f); rec(f, m("clock open, presenter view", "The clock opened large (C or a click): frosted glass over the dimmed slide, with the presenter's wait-time buttons beneath it."));
    await tab.eval(`document.querySelector('[data-wait="2"]').click(); true`); await sleep(1500);
    await tab.eval(PRESENTER);
    f = path.join(D, `clock-open-wait-${size}.png`); await tab.shot(f); rec(f, m("clock open, wait running, presenter view", "A 2-minute wait running inside the open clock."));
    await tab.eval(ROOM);
    f = path.join(D, `clock-open-wait-room-${size}.png`); await tab.shot(f); rec(f, m("clock open, wait running, room view", "The same moment as the room sees it, with the presenter's buttons faded."));
    await tab.eval(`openClock(false); true`); await sleep(900);
    f = path.join(D, `clock-corner-wait-${size}.png`); await tab.shot(f); rec(f, m("corner clock with a wait", "The wait follows the clock to the corner as a small pill."));
    await tab.eval(`document.getElementById("sc-wait-clear").click(); show(8); true`); await sleep(800);
    await tab.eval(`timerAction("toggle"); true`); await sleep(1500);
    f = path.join(D, `timer-running-${size}.png`); await tab.shot(f); rec(f, m("screen timer running", "Show & Tell's turn timer, started (T)."));
    await tab.eval(`timerAction("toggle"); true`); await sleep(500);
    f = path.join(D, `timer-paused-${size}.png`); await tab.shot(f); rec(f, m("screen timer paused", "The same timer, paused."));
    // Over time: pretend the call to order was two hours and ten minutes ago
    await tab.eval(`STAGE_TIMER.saveStart(browserStore(), sessionDay(), sessionNow() - 7800); tick(); true`); await sleep(800);
    f = path.join(D, `clock-over-${size}.png`); await tab.shot(f); rec(f, m("clock over time", "Past the end of the two hours: the corner clock counts over."));
    await tab.eval(`localStorage.clear(); true`);
    console.log("  stage", size);
  }
};

// 4. Speaker notes, alone and following a stage in the same browser
JOBS.notes = async (tab) => {
  const D = path.join(OUT, "notes");
  for (const [size, vw, vh, dpr, mobile] of [["560", 560, 780, 2, false], ["375", 375, 812, 2, true], ["1280", 1280, 800, 1, false]]) {
    await tab.viewport(vw, vh, { dpr, mobile, theme: "light" });
    await tab.go(BASE + "notes.html", 900);
    await slices(tab, D, `alone-screen01-${size}`, { surface: "notes", state: "alone, screen 1", width: vw, theme: "notes", note: "Opened on its own, no stage in the same browser. 560×780 is the size the stage's S key opens it at." }, { max: 4 });
  }
  // With a stage: open the stage in a second tab in the same browser
  const stage = await Tab.open();
  await stage.viewport(1280, 720, { theme: "light" });
  await stage.go(BASE + "present.html#6", 900);
  await tab.viewport(560, 780, { dpr: 2, theme: "light" });
  await tab.go(BASE + "notes.html", 1500);
  await stage.eval(`timerAction("toggle"); true`); await sleep(1500);
  await slices(tab, D, `with-stage-screen07-560`, { surface: "notes", state: "following the stage, screen 7", width: 560, theme: "notes", note: "The notes window beside a stage on screen 7, Three levels of getting started (no timer on this screen); the clock not called to order." }, { max: 4 });
  await stage.eval(`show(9); true`); await sleep(1200);
  await slices(tab, D, `with-stage-screen10-560`, { surface: "notes", state: "following the stage, screen 10", width: 560, theme: "notes", note: "The notes window beside a stage on screen 10, Pick your level." }, { max: 4 });
  // The screen list, opened from the screen number in the status bar
  await tab.eval(`document.getElementById("jump").click(); true`); await sleep(500);
  let f = path.join(D, `jump-list-560.png`); await tab.shot(f); rec(f, { surface: "notes", state: "the screen list open", width: 560, theme: "notes", note: "After pressing the screen number in the status bar: every screen under its part; choosing one moves the stage." });
  await tab.eval(`document.getElementById("jump-list").close(); true`);
  // Full size, beside the stage, and in Night
  await stage.eval(`show(8); true`); await sleep(800);
  await tab.viewport(1280, 800, { dpr: 1, theme: "light" });
  await tab.go(BASE + "notes.html", 1500);
  await slices(tab, D, `with-stage-screen09-1280`, { surface: "notes", state: "following the stage, full size", width: 1280, theme: "notes", note: "The notes at 1280 wide beside a stage on screen 9 (a timed screen)." }, { max: 3 });
  await tab.viewport(560, 780, { dpr: 2, theme: "dark" });
  await tab.go(BASE + "notes.html", 1500);
  await slices(tab, D, `with-stage-screen09-560-night`, { surface: "notes", state: "following the stage, Night", width: 560, theme: "notes-night", note: "The notes in the site's Night theme, beside a stage on screen 9." }, { max: 3 });
  await stage.close();
};

// 3b. The stage's screen timer on a screen that has one (Show & Tell's turn timer, screen 9), running and paused
JOBS.timerfix = async (tab) => {
  const D = path.join(OUT, "stage");
  for (const [size, vw, vh, dpr, mobile] of [["1280", 1280, 720, 1, false], ["375", 375, 812, 2, true]]) {
    await tab.viewport(vw, vh, { dpr, mobile, theme: "light" });
    await tab.go("about:blank", 100);
    await tab.go(BASE + "present.html", 900);
    await tab.eval(`localStorage.clear(); document.getElementById("sc-start").click(); show(8); true`); await sleep(1000);
    await tab.eval(`timerAction("toggle"); true`); await sleep(3000);
    const m = (state, note) => ({ surface: "stage", state, width: vw, theme: "stage", note });
    await tab.eval(ROOM);
    let f = path.join(D, `timer-running-${size}.png`); await tab.shot(f); rec(f, m("screen timer running, room view", "Screen 9, Show & Tell (\"Done one of these?\"): its 4-minute turn timer started (T), session called to order, as the room sees it."));
    await tab.eval(PRESENTER);
    f = path.join(D, `timer-running-presenter-${size}.png`); await tab.shot(f); rec(f, m("screen timer running, presenter view", "The same moment with the presenter's controls showing."));
    await tab.eval(`timerAction("toggle"); true`); await sleep(600);
    await tab.eval(PRESENTER);
    f = path.join(D, `timer-paused-${size}.png`); await tab.shot(f); rec(f, m("screen timer paused, presenter view", "The same timer, paused."));
    await tab.eval(`localStorage.clear(); true`);
  }
};

// 4b. The notes beside a stage that is on a timed screen, with the session called to order
JOBS.notesfix = async (tab) => {
  const D = path.join(OUT, "notes");
  const stage = await Tab.open();
  await stage.viewport(1280, 720, { theme: "light" });
  await stage.go(BASE + "present.html", 900);
  await stage.eval(`localStorage.clear(); document.getElementById("sc-start").click(); show(8); true`);
  await sleep(600);
  await stage.eval(`timerAction("toggle"); true`);
  await tab.viewport(560, 780, { dpr: 2, theme: "light" });
  await tab.go(BASE + "notes.html", 1800);
  await sleep(2500);
  const title = await stage.eval(`screens[index].heading + " · screen " + (index + 1)`);
  await slices(tab, D, `with-stage-timed-560`, { surface: "notes", state: "following the stage on a timed screen, clock called", width: 560, theme: "notes", note: "The stage is on " + title + ", called to order a few seconds earlier, its turn timer started." }, { max: 4 });
  await tab.viewport(375, 812, { dpr: 2, mobile: true, theme: "light" });
  await tab.go(BASE + "notes.html", 1800);
  await sleep(1500);
  await slices(tab, D, `with-stage-timed-375`, { surface: "notes", state: "following the stage on a timed screen, phone", width: 375, theme: "notes", note: "Same, at phone width." }, { max: 4 });
  await stage.eval(`localStorage.clear(); true`);
  await stage.close();
};

// 5. The six starters on their own: at the Play window's size and on a phone, before and after one interaction
JOBS.cabinets = async (tab) => {
  const D = path.join(OUT, "cabinets");
  const acts = {
    "meeting-timer": `document.getElementById("start").click()`,
    "group-maker": `document.getElementById("again").click()`,
    "feedback-builder": `(() => { const r = document.querySelectorAll("input[type=radio], button[data-level], .level button"); r.forEach((x, i) => { if (i % 3 === 1) x.click(); }); })()`,
    "oracle": `(() => { const q = document.querySelector("input, textarea"); q.value = "Will the copier work on Monday?"; q.dispatchEvent(new Event("input", { bubbles: true })); document.getElementById("go").click(); })()`,
    "charter-cards": `document.querySelectorAll(".card")[1].click()`,
    "syllabus-page": `document.querySelectorAll(".units button")[1].click()`
  };
  for (const name of Object.keys(acts)) {
    for (const [size, vw, vh, dpr, mobile] of [["960", 960, 640, 1, false], ["375", 375, 812, 2, true]]) {
      await tab.viewport(vw, vh, { dpr, mobile, theme: "light" });
      await tab.go(BASE + "cabinets/" + name + ".html", 900);
      await slices(tab, D, `${name}-${size}`, { surface: "cabinet:" + name, state: "as it opens", width: vw, theme: "own", note: "The starter file on its own, as it runs in the Play window or in an AI's preview." }, { max: 5 });
      try { await tab.eval(acts[name] + "; true"); } catch (e) { console.warn("  act", name, e.message.split("\n")[0]); }
      await sleep(name === "oracle" ? 4500 : 1200);
      await slices(tab, D, `${name}-${size}-after`, { surface: "cabinet:" + name, state: "after its main action", width: vw, theme: "own", note: "After its first main action (start, shuffle, choose levels, consult, open a card)." }, { max: 5 });
    }
  }
};

// 6. Motion: frame strips of the transitions people will see
JOBS.motion = async (tab) => {
  const D = path.join(OUT, "motion");
  await tab.send("Browser.grantPermissions", { origin: BASE.slice(0, -1), permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"] }).catch(() => {});
  await setup(tab, "desk", "light");
  await tab.go(BASE + "starters.html");
  await tab.eval(`document.querySelector('[data-play="timer"]').scrollIntoView({ block: "center", behavior: "instant" }); true`);
  await frames(tab, path.join(D, "play-open.png"), `document.querySelector('[data-play="timer"]').click(); true`, { ms: 900, meta: { surface: "starters", state: "opening the Play window", width: 1280, theme: "light" } });
  await tab.eval(`document.getElementById("room-close").click(); true`); await sleep(400);
  await frames(tab, path.join(D, "remix-open.png"), `document.querySelector("details.remix summary").click(); true`, { ms: 700, meta: { surface: "starters", state: "opening a Remix menu", width: 1280, theme: "light" } });
  await frames(tab, path.join(D, "next-step.png"), `document.querySelector("[data-copy-machine]").click(); true`, { ms: 900, meta: { surface: "starters", state: "Copy for my AI: the next-step panel arriving", width: 1280, theme: "light" } });
  await tab.go(BASE + "starters.html");
  await frames(tab, path.join(D, "toast.png"), `const d = document.querySelector("details.remix"); d.open = true; d.querySelector("li button").scrollIntoView({ block: "center", behavior: "instant" }); d.querySelector("li button").click(); true`, { ms: 900, meta: { surface: "starters", state: "a toast arriving", width: 1280, theme: "light" } });
  await tab.go(BASE + "index.html?now=10:30");
  await frames(tab, path.join(D, "cue.png"), `showCue(segments[4]); true`, { ms: 700, meta: { surface: "home", state: "the part-changed notice arriving", width: 1280, theme: "light" } });
  await tab.go(BASE + "index.html");
  await frames(tab, path.join(D, "anchor-jump.png"), `document.querySelector('a[href="#start"]').click(); true`, { ms: 1200, meta: { surface: "home", state: "pressing Start here (an in-page link)", width: 1280, theme: "light" } });
  // The stage
  await tab.viewport(1280, 720, { theme: "light" });
  await tab.go(BASE + "present.html#0", 900);
  await tab.eval(`localStorage.clear(); true`);
  await tab.go(BASE + "present.html#3", 900);
  await frames(tab, path.join(D, "stage-next.png"), `show(4); true`, { ms: 700, meta: { surface: "stage", state: "moving to the next screen", width: 1280, theme: "stage" } });
  await tab.go(BASE + "present.html#0", 900);
  await tab.eval(`document.getElementById("sc-start").click(); true`); await sleep(500);
  await frames(tab, path.join(D, "clock-glide.png"), `show(1); true`, { ms: 1100, meta: { surface: "stage", state: "the clock gliding from the title screen to the corner", width: 1280, theme: "stage" } });
  await frames(tab, path.join(D, "clock-open.png"), `openClock(true); true`, { ms: 900, meta: { surface: "stage", state: "opening the clock large", width: 1280, theme: "stage" } });
  await frames(tab, path.join(D, "clock-close.png"), `openClock(false); true`, { ms: 900, meta: { surface: "stage", state: "making the clock small again", width: 1280, theme: "stage" } });
  await tab.eval(`localStorage.clear(); true`);
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = spawn(process.execPath, [path.join(REPO, "scripts/serve.js")], { env: { ...process.env, PORT: "4179" }, stdio: "ignore" });
  const { proc } = await launch(path.join(OUT, "..", "chrome-profile"));
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(BASE + "index.html")).ok) break; } catch {} await sleep(250); }   // the server is up
    const tab = await Tab.open();
    await setup(tab, "desk", "light");
    await tab.go(BASE + "index.html");
    const fonts = await fontsOk(tab);
    console.log("fonts", fonts);
    if (!fonts.montserrat || !fonts.newsreader) console.warn("WARNING: brand fonts did not load; screenshots would show fallbacks");
    for (const [name, job] of Object.entries(JOBS)) {
      if (ONLY && !ONLY.includes(name)) continue;
      console.log("job", name);
      const t = Date.now();
      try { await job(tab); } catch (e) { console.error("job failed", name, e); }
      console.log("  done in", Math.round((Date.now() - t) / 1000), "s");
    }
  } finally {
    const mf = path.join(OUT, ONLY ? `manifest-${ONLY.join("-")}.json` : "manifest.json");
    fs.writeFileSync(mf, JSON.stringify(manifest, null, 1));
    proc.kill(); server.kill();
  }
})();
