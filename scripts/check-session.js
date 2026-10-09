// Checks the session file the way the pages read it: node scripts/check-session.js
// The pre-commit and pre-push hooks in .githooks run it too (git config core.hooksPath .githooks).
// A {brace} the clock doesn't know shows on the page as typed, and the browser only
// mentions it in the console. This turns that, and a few cousins, into a failure.
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const problems = new Set();
let checkingPages = false;   // the page check names the page itself, so the clock's own message would repeat it

// Load the session file and the clock as a page would, with every console complaint counted
const context = {
  console: {
    log() {},
    warn: (message) => problems.add(message),
    error: (message) => { if (!checkingPages) problems.add(message); }
  },
  document: { querySelectorAll: () => [] },
  Intl, Date
};
vm.createContext(context);
vm.runInContext(read("assets/session.js") + "\nthis.SESSION = SESSION;", context, { filename: "assets/session.js" });
vm.runInContext(read("assets/timing.js") + "\nthis.TIMES = TIMES;", context, { filename: "assets/timing.js" });
const { SESSION, TIMES } = context;

// The parts fill the session exactly: the clock already complains if they run long, this catches short
const last = SESSION.segments[SESSION.segments.length - 1];
if (last && last.end < SESSION.end) problems.add("The parts end at " + last.end + ", before the session's end at " + SESSION.end + ".");

// Every link a part names is in the links list, and every link is a web address
SESSION.segments.forEach((segment) => {
  (segment.shared || []).forEach(({ link }) => {
    if (!(link in SESSION.links)) problems.add("The part \"" + segment.id + "\" shares a link the session file doesn't have: " + link);
  });
});
Object.entries(SESSION.links).forEach(([name, url]) => {
  if (url && !/^https:\/\//.test(url)) problems.add("The link \"" + name + "\" isn't an https address: " + url);
});

// The pages: braces inside data-fill get filled; braces anywhere else show as typed
const TOKEN = /\{[A-Za-z][\w.]*(?:\s*[+-]\s*\w+)?(?::\w+)?\}/g;
checkingPages = true;
const pages = fs.readdirSync(root).filter((file) => file.endsWith(".html"));
pages.forEach((page) => {
  let html = read(page).replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  html = html.replace(/<(\w+)([^>]*\sdata-fill[^>]*)>([\s\S]*?)<\/\1>/g, (whole, tag, attributes, inner) => {
    const text = inner.replace(/<[^>]+>/g, "");
    (text.match(TOKEN) || []).forEach((token) => {
      if (TIMES.fill(token) === token) problems.add(page + ": the session file doesn't know " + token);
    });
    return "";
  });
  (html.replace(/<[^>]+>/g, "").match(TOKEN) || []).forEach((token) => {
    problems.add(page + ": " + token + " sits outside a data-fill element, so it shows as typed");
  });
});

// Every script parses: one syntax error stops a whole file, and the page goes quiet without saying why
const scripts = ["assets", "scripts"].flatMap((dir) => fs.readdirSync(path.join(root, dir))
  .filter((file) => file.endsWith(".js")).map((file) => ({ name: dir + "/" + file, code: read(dir + "/" + file) })));
pages.concat(fs.readdirSync(path.join(root, "cabinets")).map((file) => "cabinets/" + file)).forEach((page) => {
  [...read(page).matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)].forEach((match, i) => {
    scripts.push({ name: page + " (inline script " + (i + 1) + ")", code: match[1] });
  });
});
scripts.forEach(({ name, code }) => {
  try {
    new vm.Script(code.replace(/^#!.*/, ""), { filename: name });
  } catch (error) {
    problems.add(name + ": " + error.message);
  }
});

if (problems.size) {
  console.error("session check: " + problems.size + " problem" + (problems.size === 1 ? "" : "s"));
  problems.forEach((problem) => console.error("  - " + problem));
  process.exit(1);
}
console.log("session check: " + SESSION.segments.length + " parts, " + Object.keys(SESSION.links).length + " links, " + pages.length + " pages, all clear");
