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
// (in minutes, so "9:00" and "09:00" are the same time)
const minutes = (time) => { const [h, m] = time.split(":").map(Number); return h * 60 + m; };
const last = SESSION.segments[SESSION.segments.length - 1];
if (last && minutes(last.end) < minutes(SESSION.end)) problems.add("The parts end at " + last.end + ", before the session's end at " + SESSION.end + ".");

// Every link a part names is in the links list, and every link is a web address
SESSION.segments.forEach((segment) => {
  (segment.shared || []).forEach(({ link }) => {
    if (!(link in SESSION.links)) problems.add("The part \"" + segment.id + "\" shares a link the session file doesn't have: " + link);
  });
});
Object.entries(SESSION.links).forEach(([name, url]) => {
  if (url && !/^https:\/\//.test(url)) problems.add("The link \"" + name + "\" isn't an https address: " + url);
});
Object.entries(SESSION.record || {}).forEach(([name, url]) => {
  if (!["ran", "next"].includes(name) && url && !/^https:\/\//.test(url)) problems.add("The record's \"" + name + "\" isn't an https address: " + url);
});
if (/^https?:\/\//.test(SESSION.url)) problems.add("The session's url should be written without https://: " + SESSION.url);

// The session file types the site's own address somewhere other than `url`: write https://{url} instead,
// so a copy of the kit sends people to its own site (the clock has filled the braces by now, so read the file itself)
if (/https:\/\/(inquiredu\.org|[\w.-]+\.github\.io)/.test(read("assets/session.js"))) {
  problems.add("The session file types the site's address; write https://{url} and set `url` once");
}

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

// Every copy well says what it holds and where it goes, in its first line: a prompt is words for an AI chat, a script
// is code for the place that runs it, a message is for a person. The one time people pasted code where a prompt goes
// (October 9), nothing near the button said which was which.
pages.forEach((page) => {
  const html = read(page).replace(/<!--[\s\S]*?-->/g, "");
  [...html.matchAll(/<div\b[^>]*\bclass="(?:[^"]*\s)?copybox(?:\s[^"]*)?"[^>]*>\s*(<[^>]+>)/g)].forEach(([, first]) => {
    if (!/class="copy-kind"/.test(first)) problems.add(page + ": a copy well doesn't start with its copy-kind line (Prompt, Script, or Message, and where it goes)");
  });
  [...html.matchAll(/<p class="copy-kind"[^>]*>[\s\S]*?<strong>([^<]*)<\/strong>\s*<span>([^<]*)<\/span>/g)].forEach(([, kind, where]) => {
    if (!["Prompt", "Script", "Message"].includes(kind)) problems.add(page + ": a copy-kind line names \"" + kind + "\"; it should be Prompt, Script, or Message");
    if (!where.trim()) problems.add(page + ": a copy-kind line for " + kind + " doesn't say where it goes");
  });
});

// Every script kit a page asks for is written in site.js, and each kit's script has the settings line and the function
// its steps name, so the box that fills the ID and the step that says "choose inventory" both meet the real file
const kitSource = read("assets/site.js").match(/const SCRIPT_KITS = (\{[\s\S]*?\n\});/);
const kits = kitSource ? vm.runInNewContext("(" + kitSource[1] + ")") : {};
if (!kitSource) problems.add("assets/site.js: can't find SCRIPT_KITS");
pages.forEach((page) => {
  [...read(page).matchAll(/data-script-kit="([^"]*)"/g)].forEach(([, id]) => {
    if (!kits[id]) problems.add(page + ": asks for a script kit site.js doesn't have: " + id);
  });
});
Object.entries(kits).forEach(([id, kit]) => {
  if (!fs.existsSync(path.join(root, kit.file))) { problems.add("The " + id + " kit's script doesn't exist: " + kit.file); return; }
  const code = read(kit.file);
  if (!new RegExp("^const " + kit.setting.name + ' = "', "m").test(code)) problems.add(kit.file + ": has no settings line const " + kit.setting.name + ' = "…" for the kit\'s address box');
  if (!new RegExp("^function " + kit.fn + "\\(", "m").test(code)) problems.add(kit.file + ": has no function " + kit.fn + "(), which the kit's steps tell people to choose");
  if (!["standalone", "bound"].includes(kit.lives)) problems.add("The " + id + " kit says it lives \"" + kit.lives + "\"; it's standalone or bound");
  if (kit.lives === "bound" && !/getActive(Spreadsheet|Document|Presentation|Form)\(\)/.test(code)) problems.add(kit.file + ": a bound script that never uses the file it lives in");
});

// Every script parses: one syntax error stops a whole file, and the page goes quiet without saying why
const scripts = ["assets", "scripts", "recipes"].flatMap((dir) => fs.readdirSync(path.join(root, dir))
  .filter((file) => file.endsWith(".js") || file.endsWith(".gs")).map((file) => ({ name: dir + "/" + file, code: read(dir + "/" + file) })));
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

// Every stylesheet and script a page loads carries a stamp of its current contents, so the page and its styles
// arrive together (scripts/stamps.js)
require("./stamps.js").problems(root, pages).forEach((problem) => problems.add(problem));

if (problems.size) {
  console.error("session check: " + problems.size + " problem" + (problems.size === 1 ? "" : "s"));
  problems.forEach((problem) => console.error("  - " + problem));
  process.exit(1);
}
console.log("session check: " + SESSION.segments.length + " parts, " + Object.keys(SESSION.links).length + " links, " + pages.length + " pages, all clear");
