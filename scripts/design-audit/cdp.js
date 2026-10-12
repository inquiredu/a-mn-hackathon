// Minimal Chrome DevTools Protocol client over Node's global WebSocket. No dependencies.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9341;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function launch(profileDir) {
  fs.mkdirSync(profileDir, { recursive: true });
  const proc = spawn(CHROME, [
    "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profileDir}`,
    "--hide-scrollbars", "--no-first-run", "--no-default-browser-check", "--disable-extensions",
    "--force-color-profile=srgb", "--font-render-hinting=none", "about:blank"
  ], { stdio: "ignore" });
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (r.ok) return { proc, version: await r.json() };
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome did not start");
}

class Tab {
  constructor(ws, id) { this.ws = ws; this.id = id; this.seq = 0; this.pending = new Map(); this.handlers = new Map(); }
  static async open(url = "about:blank") {
    const r = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
    const info = await r.json();
    const ws = new WebSocket(info.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    const tab = new Tab(ws, info.id);
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && tab.pending.has(msg.id)) {
        const { res, rej } = tab.pending.get(msg.id);
        tab.pending.delete(msg.id);
        msg.error ? rej(new Error(msg.error.message + " " + (msg.error.data || ""))) : res(msg.result);
      } else if (msg.method) {
        (tab.handlers.get(msg.method) || []).forEach((h) => h(msg.params));
      }
    };
    await tab.send("Page.enable");
    await tab.send("Runtime.enable");
    await tab.send("DOM.enable");
    await tab.send("CSS.enable");
    return tab;
  }
  send(method, params = {}) {
    const id = ++this.seq;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((res, rej) => this.pending.set(id, { res, rej }));
  }
  on(method, fn) { if (!this.handlers.has(method)) this.handlers.set(method, []); this.handlers.get(method).push(fn); }
  off(method) { this.handlers.delete(method); }
  async eval(expr) {
    const r = await this.send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true });
    if (r.exceptionDetails) throw new Error("eval: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text) + "\n  in: " + expr.slice(0, 200));
    return r.result.value;
  }
  async viewport(width, height, { dpr = 1, mobile = false, theme = "light" } = {}) {
    await this.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: dpr, mobile });
    await this.send("Emulation.setTouchEmulationEnabled", mobile ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
    await this.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }, { name: "prefers-reduced-motion", value: "no-preference" }] });
    // The site opens in Night whatever the system says, so the theme is also saved as the visitor's choice
    // (assets/theme.js), from the next page loaded on
    if (this.themeScript) await this.send("Page.removeScriptToEvaluateOnNewDocument", { identifier: this.themeScript });
    this.themeScript = (await this.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `try { localStorage.setItem("first-builds-theme", ${JSON.stringify(theme)}); } catch (e) {}`
    })).identifier;
  }
  async go(url, settle = 600) {
    const loaded = new Promise((res) => { const h = () => { this.off("Page.loadEventFired"); res(); }; this.on("Page.loadEventFired", h); });
    await this.send("Page.navigate", { url });
    await Promise.race([loaded, sleep(15000)]);
    await this.eval("document.fonts.ready.then(() => true)");
    await sleep(settle);
  }
  async shot(file, clip) {
    const params = { format: "png" };
    if (clip) { params.clip = { ...clip, scale: 1 }; params.captureBeyondViewport = false; }
    const r = await this.send("Page.captureScreenshot", params);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, Buffer.from(r.data, "base64"));
    return file;
  }
  async close() { try { this.ws.close(); await fetch(`http://127.0.0.1:${PORT}/json/close/${this.id}`); } catch {} }
}

module.exports = { launch, Tab, sleep, PORT };
