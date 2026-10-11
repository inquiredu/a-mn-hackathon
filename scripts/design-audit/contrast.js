// Contrast of text in the states the October 11 pass skipped: the cue, toasts, dialogs, the next-step panel,
// open folds, and hover/focus states (forced). node contrast.js <repo> <out.md>
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { launch, Tab, sleep } = require("./cdp.js");
const REPO = path.resolve(process.argv[2]);
const OUT = path.resolve(process.argv[3]);
const BASE = "http://localhost:4179/";

// Measures every visible text run inside `root`, against the first opaque background up the tree
const MEASURE = (rootSel) => `(() => {
  const lum = (c) => { const m = c.match(/[\\d.]+/g).map(Number); const [r, g, b] = m.slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const alpha = (c) => { const m = c.match(/[\\d.]+/g).map(Number); return m.length > 3 ? m[3] : 1; };
  const mix = (fg, bg) => { const f = fg.match(/[\\d.]+/g).map(Number), b = bg.match(/[\\d.]+/g).map(Number); const a = f.length > 3 ? f[3] : 1; return "rgb(" + [0, 1, 2].map((i) => Math.round(f[i] * a + b[i] * (1 - a))).join(",") + ")"; };
  const bgOf = (e) => { const stack = []; for (let n = e; n; n = n.parentElement) { const b = getComputedStyle(n).backgroundColor; if (alpha(b) > 0) { stack.push(b); if (alpha(b) >= 1) break; } }
    let out = "rgb(255,255,255)"; if (!stack.length) { const html = getComputedStyle(document.documentElement).backgroundColor; out = alpha(html) ? html : out; }
    for (let i = stack.length - 1; i >= 0; i--) out = mix(stack[i], out); return out; };
  const rows = [];
  document.querySelectorAll(${JSON.stringify(rootSel)}).forEach((root) => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const t = w.currentNode, e = t.parentElement; if (!t.textContent.trim() || !e) continue;
      const r = e.getBoundingClientRect(), cs = getComputedStyle(e); if (!r.width || cs.visibility === "hidden" || cs.display === "none" || e.closest(".sr-only,[hidden]")) continue;
      let op = 1; for (let n = e; n; n = n.parentElement) op *= Number(getComputedStyle(n).opacity);
      const bg = bgOf(e); let fg = cs.color; if (op < 1) fg = mix(fg.replace(/rgba?\\(([^)]+)\\)/, (m, v) => { const p = v.split(",").map(Number); return "rgba(" + p.slice(0, 3).join(",") + "," + ((p[3] ?? 1) * op) + ")"; }), bg); else if (alpha(fg) < 1) fg = mix(fg, bg);
      const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      const size = parseFloat(cs.fontSize), bold = Number(cs.fontWeight) >= 600; const large = size >= 24 || (bold && size >= 18.66);
      rows.push({ text: t.textContent.trim().slice(0, 40), ratio: Math.round(ratio * 100) / 100, need: large ? 3 : 4.5, fg, bg, size, el: e.tagName.toLowerCase() + (typeof e.className === "string" && e.className ? "." + e.className.split(" ")[0] : "") });
    }
  });
  return rows;
})()`;

(async () => {
  const server = spawn(process.execPath, [path.join(REPO, "scripts/serve.js")], { env: { ...process.env, PORT: "4179" }, stdio: "ignore" });
  const { proc } = await launch(path.join(path.dirname(OUT), "chrome-profile-contrast"));
  const lines = ["# Contrast in the states the October 11 pass skipped", "", "Each visible text run measured against its effective background (opacity and translucent fills composited). Fails are under 4.5:1 (3:1 for large text).", ""];
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(BASE + "index.html")).ok) break; } catch {} await sleep(250); }
    const tab = await Tab.open();
    await tab.send("Browser.grantPermissions", { origin: BASE.slice(0, -1), permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"] }).catch(() => {});
    for (const theme of ["light", "dark"]) {
      await tab.viewport(1280, 800, { theme });
      const report = async (label, sel) => {
        const rows = await tab.eval(MEASURE(sel));
        const fails = rows.filter((r) => r.ratio < r.need);
        const min = rows.reduce((m, r) => Math.min(m, r.ratio), 99);
        lines.push(`- **${label}** (${theme}): ${rows.length} runs, lowest ${min === 99 ? "n/a" : min + ":1"}${fails.length ? `, **${fails.length} fail**: ` + fails.slice(0, 6).map((f) => `"${f.text}" ${f.ratio}:1 (${f.el}, ${f.fg} on ${f.bg})`).join("; ") : ", all pass"}`);
      };
      await tab.go(BASE + "index.html?now=10:30"); await tab.eval("showCue(segments[4]); true"); await sleep(300);
      await report("Home: the part-changed notice (cue)", ".cue");
      await report("Home: now bar", ".nowbar-inner");
      await report("Home during: Happening now card", ".nowcard");
      await tab.go(BASE + "starters.html");
      await tab.eval(`const d = document.querySelector("details.remix"); d.open = true; d.querySelector("li button").click(); true`); await sleep(500);
      await report("Starters: open Remix menu", "details.remix[open]");
      await report("Toast", "#toast");
      await tab.eval(`document.querySelector("[data-copy-machine]").click(); true`); await sleep(700);
      await report("Next-step panel", "#next-step");
      await tab.eval(`copyByHand("Sample text to copy by hand"); true`); await sleep(300);
      await report("Copy-by-hand dialog", "#fallback");
      await tab.eval(`document.getElementById("fallback").close(); document.querySelector('[data-play="timer"]').click(); true`); await sleep(1200);
      await report("Play window header", "#room .room-head");
      await tab.eval(`document.getElementById("toggle-code").click(); document.getElementById("run").click(); true`); await sleep(500);
      await report("Play window code pane and message", "#room .code-pane, #room .toast");
      // Hover and focus, forced, on every control on a few pages
      for (const page of ["index.html", "starters.html", "wish.html", "hosts.html", "sources.html"]) {
        await tab.go(BASE + page);
        await tab.eval(`document.querySelectorAll("details").forEach((d) => d.open = true); true`);
        const { root } = await tab.send("DOM.getDocument", { depth: -1 });
        const { nodeIds } = await tab.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: "a[href], button, summary" });
        for (const pc of ["hover", "focus-visible"]) {
          for (const id of nodeIds) await tab.send("CSS.forcePseudoState", { nodeId: id, forcedPseudoClasses: pc === "hover" ? ["hover"] : ["focus", "focus-visible"] }).catch(() => {});
          await sleep(100);
          await report(`${page}: every link and button, ${pc} forced`, "a[href], button, summary");
          for (const id of nodeIds) await tab.send("CSS.forcePseudoState", { nodeId: id, forcedPseudoClasses: [] }).catch(() => {});
        }
      }
    }
  } finally {
    fs.writeFileSync(OUT, lines.join("\n") + "\n");
    proc.kill(); server.kill();
  }
  console.log("wrote", OUT);
})();
