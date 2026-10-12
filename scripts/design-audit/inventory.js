// Facts for the interaction and system reviewers: every interactive element's look in its default, hover,
// focus-visible, and pressed states (forced with CSS.forcePseudoState), its size, its transition; target sizes
// at phone width; the type styles in use; reading measure; animations.
// node inventory.js <repo> <outDir>
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { launch, Tab, sleep } = require("./cdp.js");

const REPO = path.resolve(process.argv[2]);
const OUT = path.resolve(process.argv[3]);
const BASE = "http://localhost:4179/";
const PAGES = ["index.html", "levels.html", "starters.html", "invent.html", "hosts.html", "sources.html", "notes.html", "present.html#4", "present.html#0"];
const SEL = 'a[href], button, summary, input, textarea, select, [role="tab"], [tabindex]:not([tabindex="-1"])';
const PROPS = ["color", "background-color", "border-top-color", "border-top-width", "border-top-style", "border-radius", "box-shadow",
  "outline-style", "outline-width", "outline-color", "outline-offset", "text-decoration-line", "text-decoration-color", "text-decoration-thickness", "text-underline-offset",
  "transform", "opacity", "cursor", "transition-property", "transition-duration", "transition-timing-function",
  "font-family", "font-size", "font-weight", "letter-spacing", "text-transform", "padding-top", "padding-left", "line-height"];

const SNAP = `function () {
  const cs = getComputedStyle(this); const r = this.getBoundingClientRect();
  const o = {}; ${JSON.stringify(PROPS)}.forEach((p) => o[p] = cs.getPropertyValue(p));
  o["font-family"] = o["font-family"].split(",")[0].replace(/"/g, "");
  const inline = this.tagName === "A" && cs.display === "inline" && !!this.closest("p, li, span.hint, dd") && !this.className;
  return { style: o, w: Math.round(r.width), h: Math.round(r.height), visible: r.width > 0 && r.height > 0 && cs.visibility !== "hidden",
    tag: this.tagName.toLowerCase(), cls: (typeof this.className === "string" ? this.className : "").trim(), id: this.id || "",
    text: (this.getAttribute("aria-label") || this.textContent || this.value || this.placeholder || "").trim().replace(/\\s+/g, " ").slice(0, 60),
    inline, display: cs.display, parent: this.parentElement ? (this.parentElement.className || this.parentElement.tagName.toLowerCase()) : "" };
}`;

function diff(a, b) {
  const d = {};
  for (const k of Object.keys(b)) if (a[k] !== b[k]) d[k] = a[k] + "  →  " + b[k];
  return d;
}

async function nodes(tab, selector) {
  const { root } = await tab.send("DOM.getDocument", { depth: -1, pierce: false });
  const { nodeIds } = await tab.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector });
  return nodeIds;
}

async function snap(tab, nodeId) {
  const { object } = await tab.send("DOM.resolveNode", { nodeId });
  const r = await tab.send("Runtime.callFunctionOn", { objectId: object.objectId, functionDeclaration: SNAP, returnByValue: true });
  return r.result.value;
}

async function inventoryPage(tab, page, theme) {
  const ids = await nodes(tab, SEL);
  const groups = new Map();
  for (const nodeId of ids) {
    let base;
    try { base = await snap(tab, nodeId); } catch { continue; }
    if (!base.visible) continue;
    const states = {};
    for (const pc of ["hover", "focus-visible", "active"]) {
      try {
        await tab.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: pc === "focus-visible" ? ["focus", "focus-visible"] : [pc] });
        const s = await snap(tab, nodeId);
        states[pc] = diff(base.style, s.style);
      } catch { states[pc] = { error: "could not force" }; }
      await tab.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [] }).catch(() => {});
    }
    const key = [base.tag, base.cls, base.inline ? "inline" : "", JSON.stringify(base.style), JSON.stringify(states)].join("|");
    if (!groups.has(key)) groups.set(key, { tag: base.tag, cls: base.cls, inline: base.inline, parent: base.parent, count: 0, examples: [], sizes: [], style: base.style, states });
    const g = groups.get(key);
    g.count++;
    if (g.examples.length < 4 && base.text) g.examples.push(base.text);
    g.sizes.push([base.w, base.h]);
  }
  return [...groups.values()].map((g) => {
    const ws = g.sizes.map((s) => s[0]), hs = g.sizes.map((s) => s[1]);
    return { ...g, sizes: undefined, size: `${Math.min(...ws)}–${Math.max(...ws)} × ${Math.min(...hs)}–${Math.max(...hs)}` };
  });
}

const PAGE_FACTS = `(() => {
  const out = {};
  // Type styles in use: every element with its own visible text
  const types = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode; const e = t.parentElement; if (!e || !t.textContent.trim()) continue;
    if (e.closest("script, style, [hidden], dialog:not([open]), .sr-only, template")) continue;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const cs = getComputedStyle(e);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    const k = [cs.fontFamily.split(",")[0].replace(/"/g, ""), cs.fontSize, cs.fontWeight, cs.lineHeight, cs.letterSpacing, cs.textTransform, cs.fontStyle, cs.color].join(" | ");
    if (!types.has(k)) types.set(k, { count: 0, samples: [], tags: new Set() });
    const g = types.get(k); g.count++; g.tags.add(e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : ""));
    if (g.samples.length < 3) g.samples.push(t.textContent.trim().replace(/\\s+/g, " ").slice(0, 50));
  }
  out.typeStyles = [...types.entries()].map(([k, v]) => ({ style: k, count: v.count, tags: [...v.tags].slice(0, 6), samples: v.samples })).sort((a, b) => b.count - a.count);
  // Reading measure: characters per line in long paragraphs and list items
  const measures = [];
  document.querySelectorAll("p, li, dd").forEach((e) => {
    const text = e.textContent.trim(); if (text.length < 160) return;
    const r = e.getBoundingClientRect(); if (!r.width) return;
    const range = document.createRange(); range.selectNodeContents(e);
    const tops = new Set([...range.getClientRects()].map((x) => Math.round(x.top)));
    const lines = Math.max(1, tops.size);
    measures.push({ cpl: Math.round(text.length / lines), lines, width: Math.round(r.width), sample: text.slice(0, 60), cls: e.className || e.parentElement.className || "" });
  });
  measures.sort((a, b) => b.cpl - a.cpl);
  out.measure = { count: measures.length, max: measures[0] || null, top: measures.slice(0, 8), median: measures.length ? measures[Math.floor(measures.length / 2)].cpl : null };
  // Animations and keyframes
  const keyframes = [];
  for (const sheet of document.styleSheets) { try { for (const rule of sheet.cssRules) if (rule.type === 7) keyframes.push(rule.name); } catch {} }
  out.keyframes = keyframes;
  out.animated = [...document.querySelectorAll("*")].filter((e) => getComputedStyle(e).animationName !== "none").map((e) => e.tagName.toLowerCase() + "." + (e.className || "") + " " + getComputedStyle(e).animationName + " " + getComputedStyle(e).animationDuration).slice(0, 20);
  out.transitioned = [...document.querySelectorAll("*")].filter((e) => { const d = getComputedStyle(e).transitionDuration; return d && d !== "0s"; }).map((e) => e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.split(" ").join(".") : "") + " {" + getComputedStyle(e).transitionProperty + " " + getComputedStyle(e).transitionDuration + "}").filter((v, i, a) => a.indexOf(v) === i).slice(0, 40);
  // Distinct surfaces: background colors in use, with what uses them
  const bgs = new Map();
  document.querySelectorAll("body *").forEach((e) => { const cs = getComputedStyle(e); const b = cs.backgroundColor; if (b === "rgba(0, 0, 0, 0)" || b === "transparent") return; const r = e.getBoundingClientRect(); if (!r.width) return;
    if (!bgs.has(b)) bgs.set(b, new Set()); bgs.get(b).add(e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : "")); });
  out.backgrounds = [...bgs.entries()].map(([c, s]) => ({ color: c, used: [...s].slice(0, 8) }));
  // Border radii and shadows in use
  const radii = new Map(), shadows = new Map();
  document.querySelectorAll("body *").forEach((e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); if (!r.width) return;
    if (cs.borderRadius !== "0px") { radii.set(cs.borderRadius, (radii.get(cs.borderRadius) || 0) + 1); }
    if (cs.boxShadow !== "none") { shadows.set(cs.boxShadow, (shadows.get(cs.boxShadow) || 0) + 1); } });
  out.radii = Object.fromEntries(radii); out.shadows = Object.fromEntries(shadows);
  out.pageHeight = document.documentElement.scrollHeight;
  return out;
})()`;

const TARGETS = `(() => {
  const small = [];
  document.querySelectorAll(${JSON.stringify(SEL)}).forEach((e) => {
    const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    if (!r.width || !r.height || cs.visibility === "hidden") return;
    const inline = e.tagName === "A" && cs.display === "inline" && !!e.closest("p, li, dd");
    if (r.width < 44 || r.height < 44) small.push({ tag: e.tagName.toLowerCase(), cls: (typeof e.className === "string" ? e.className : ""), text: (e.getAttribute("aria-label") || e.textContent || e.value || "").trim().replace(/\\s+/g, " ").slice(0, 40), w: Math.round(r.width), h: Math.round(r.height), inline, under24: r.width < 24 || r.height < 24 });
  });
  const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth ? document.documentElement.scrollWidth : 0;
  return { small, overflowX: overflow };
})()`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = spawn(process.execPath, [path.join(REPO, "scripts/serve.js")], { env: { ...process.env, PORT: "4179" }, stdio: "ignore" });
  const { proc } = await launch(path.join(OUT, "..", "chrome-profile-inv"));
  const result = {};
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(BASE + "index.html")).ok) break; } catch {} await sleep(250); }   // the server is up
    const tab = await Tab.open();
    for (const page of PAGES) {
      result[page] = {};
      for (const theme of (page.startsWith("present") || page.startsWith("notes")) ? ["light"] : ["light", "dark"]) {
        await tab.viewport(1280, 800, { theme });
        await tab.go(BASE + page, 900);
        // Open the folds so what's inside them is counted
        await tab.eval(`document.querySelectorAll("details").forEach((d) => d.open = true); true`);
        await sleep(200);
        const components = await inventoryPage(tab, page, theme);
        const facts = theme === "light" ? await tab.eval(PAGE_FACTS) : undefined;
        result[page][theme] = { components, facts };
        console.log(" ", page, theme, components.length, "component groups");
      }
      await tab.viewport(375, 812, { dpr: 2, mobile: false, theme: "light" }); await tab.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
      await tab.go(BASE + page, 900);
      await tab.eval(`document.querySelectorAll("details").forEach((d) => d.open = true); true`);
      result[page].phone = await tab.eval(TARGETS);
      result[page].phoneFacts = await tab.eval(PAGE_FACTS);
    }
  } finally {
    fs.writeFileSync(path.join(OUT, "inventory.json"), JSON.stringify(result, null, 1));
    proc.kill(); server.kill();
  }
  // A readable version
  const lines = ["# Interaction and system inventory", "", "Measured in headless Chrome, 1280×800 (light and dark) and 375×812 (light). States forced with DevTools' pseudo-class forcing. Folds were opened before measuring.", ""];
  for (const [page, r] of Object.entries(result)) {
    lines.push(`## ${page}`, "");
    for (const theme of ["light", "dark"]) {
      if (!r[theme]) continue;
      lines.push(`### Interactive elements, ${theme} (${r[theme].components.length} distinct looks)`, "");
      r[theme].components.sort((a, b) => b.count - a.count).forEach((g) => {
        const s = g.style;
        lines.push(`- **${g.tag}${g.cls ? "." + g.cls.split(" ").join(".") : ""}**${g.inline ? " (inline link)" : ""} ×${g.count} · ${g.size}px · e.g. ${g.examples.map((e) => JSON.stringify(e)).join(", ")}`);
        lines.push(`  - look: ${s["font-family"]} ${s["font-size"]}/${s["font-weight"]}${s["text-transform"] !== "none" ? " " + s["text-transform"] : ""}, color ${s.color}, bg ${s["background-color"]}, border ${s["border-top-width"]} ${s["border-top-style"]} ${s["border-top-color"]}, radius ${s["border-radius"]}, padding ${s["padding-top"]} ${s["padding-left"]}, underline ${s["text-decoration-line"]}, cursor ${s.cursor}`);
        lines.push(`  - transition: ${s["transition-duration"] === "0s" ? "none" : s["transition-property"] + " " + s["transition-duration"] + " " + s["transition-timing-function"]}`);
        for (const st of ["hover", "focus-visible", "active"]) {
          const d = g.states[st];
          const keys = Object.keys(d || {});
          lines.push(`  - ${st}: ${keys.length ? keys.map((k) => k + " " + d[k]).join("; ") : "no change"}`);
        }
      });
      lines.push("");
    }
    if (r.light?.facts) {
      const f = r.light.facts;
      lines.push(`### Type styles in use at 1280 (${f.typeStyles.length})`, "");
      f.typeStyles.forEach((t) => lines.push(`- ${t.style} · ×${t.count} · ${t.tags.join(", ")} · e.g. ${t.samples.map((x) => JSON.stringify(x)).join(", ")}`));
      lines.push("", `### Reading measure at 1280: median ${f.measure.median} characters per line over ${f.measure.count} long paragraphs`, "");
      f.measure.top.forEach((m) => lines.push(`- ${m.cpl} cpl, ${m.lines} lines, ${m.width}px wide (${m.cls}): ${JSON.stringify(m.sample)}`));
      lines.push("", `### Backgrounds in use`, "");
      f.backgrounds.forEach((b) => lines.push(`- ${b.color}: ${b.used.join(", ")}`));
      lines.push("", `### Radii: ${JSON.stringify(f.radii)}`, `### Shadows: ${JSON.stringify(f.shadows)}`, `### Keyframes: ${f.keyframes.join(", ") || "none"}`, `### Animated now: ${f.animated.join("; ") || "none"}`, "### Elements with transitions:", ...f.transitioned.map((t) => "- " + t), "");
    }
    if (r.phone) {
      lines.push(`### At 375px: horizontal overflow ${r.phone.overflowX ? r.phone.overflowX + "px wide" : "none"}; ${r.phone.small.length} targets under 44px on a side (${r.phone.small.filter((s) => s.under24 && !s.inline).length} non-inline under 24px)`, "");
      r.phone.small.filter((s) => !s.inline).forEach((s) => lines.push(`- ${s.tag}${s.cls ? "." + s.cls.split(" ").join(".") : ""} ${s.w}×${s.h}${s.under24 ? " **under 24**" : ""}: ${JSON.stringify(s.text)}`));
      const inl = r.phone.small.filter((s) => s.inline).length;
      if (inl) lines.push(`- plus ${inl} inline links in running text (exempt from target size)`);
      lines.push("", `### Reading measure at 375: median ${r.phoneFacts.measure.median} cpl`, "");
    }
  }
  fs.writeFileSync(path.join(OUT, "inventory.md"), lines.join("\n"));
  console.log("wrote", path.join(OUT, "inventory.md"));
})();
