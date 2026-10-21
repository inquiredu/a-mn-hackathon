// First Builds: the script shared by every page but the stage and the speaker notes.
// Times, links, and the day all come from the session file (assets/session.js),
// read through the clock in assets/timing.js: TIMES.fill() for {braces}. The clock decides which part is on;
// the pages show each part's length, not its clock time, so the plan reads the same if the morning runs long.
// Each part below checks that its pieces are on the page before it runs.

const $ = (id) => document.getElementById(id);
const LINKS = SESSION.links;
const EVENT_DAY = SESSION.day;

const MACHINES = {
  timer: { name: "The Meeting Timer", file: "cabinets/meeting-timer.html" },
  groups: { name: "The Group Maker", file: "cabinets/group-maker.html" },
  feedback: { name: "The Feedback Builder", file: "cabinets/feedback-builder.html" },
  oracle: { name: "The Teacher's Lounge Oracle", file: "cabinets/oracle.html" },
  charter: { name: "The Charter Cards", file: "cabinets/charter-cards.html" },
  syllabus: { name: "The Syllabus Page", file: "cabinets/syllabus-page.html" }
};

// The AI tools people paste into: one source for the next-step sheet and for every page's
// "Where do I paste it?" block (<div data-where></div>). tip: the one move before pasting, for the sheet.
// where: the same, said in full. code: how to copy the finished code out, for a page that goes on a Google Site.
const AI_TOOLS = [
  { id: "gemini", name: "Gemini", url: "https://gemini.google.com/app",
    tip: "Choose Canvas in the prompt bar (look in the + menu), then paste.",
    where: "Open gemini.google.com with your school Google account. Before you paste, choose Canvas: a button labelled Canvas under the message box, or in the + menu. (Gemini's Canvas is a workspace beside the chat, not the Canvas learning platform.) Then paste and send.",
    code: "At the top of the Canvas, choose Code, then the copy icon." },
  { id: "claude", name: "Claude", url: "https://claude.ai/new",
    tip: "Paste. It appears beside the chat; if not, turn on artifacts in Settings › Capabilities.",
    where: "Open claude.ai, paste, and send. The tool opens in a panel beside the chat (Claude calls that panel an artifact). See only code? Turn on Artifacts in Settings › Capabilities.",
    code: "Open the artifact and choose Copy, or switch it to Code and copy from there." },
  { id: "chatgpt", name: "ChatGPT", url: "https://chatgpt.com/",
    tip: "Paste, then switch on Preview on the code block.",
    where: "Open chatgpt.com, paste, and send. When a grey box of code appears, press Preview at its top, and the tool runs in its place.",
    code: "Press Copy at the top of the code box." }
];

// What success looks like, and the three ways it goes wrong, said once
const WHERE_NOTES = [
  "When it worked, you see the tool itself, with buttons you can press, in a panel beside the chat. Press one.",
  "Only code and no tool? You skipped Canvas or Preview. Start a new chat, switch it on, and paste again.",
  "Nothing pasted? Your computer may block copying from websites. The copy button then shows the text in a box, right here, to select and copy by hand.",
  "No Canvas in your school Gemini, or ChatGPT and Claude blocked? Your district decides which tools are on. Ask your technology office, and try another of the three meanwhile. In a Microsoft district, Copilot Pages can build and show small apps too."
];


// Level 3: the scripts. Each kit is written once here and drawn wherever a page asks for it
// (<div data-script-kit="inventory"></div>), on Starters and Three levels alike, so the two can't disagree.
// A kit says what the script is (code, for Apps Script) and where it lives (standalone: a project of its own at
// script.google.com; bound: inside a Sheet, made with Extensions › Apps Script), then four steps.
// In the text, `backticks` mark exact words to find or type (shown as code), *asterisks* the name of a button or
// menu, and [words](address) a link.
const permission = (job) => ({
  text: "The first run asks permission:",
  sub: [
    "A box says the project needs your permission: press *Review permissions* and choose your school account.",
    "Google may warn “This app isn't verified”, because it hasn't reviewed a script you just wrote; on a personal Gmail account it always does. Press *Advanced*, then the link that starts “Go to”. It ends in “(unsafe)”: that's Google's word for any script it hasn't reviewed, including your own.",
    "It lists what the script may do, each with a box to tick: see, edit, create, and delete your Google Drive files, and your Sheets. That's Google's standard wording for any script that touches Drive. " + job + " Tick every box, then press the button at the bottom (*Continue* or *Allow*)."
  ],
  stop: "Stop here if you see “blocked by your administrator”: your district doesn't allow scripts. Ask your technology office."
});
const SCRIPT_KITS = {
  inventory: {
    name: "The Drive Inventory",
    file: "recipes/drive-inventory.gs",
    lives: "standalone",
    fn: "inventory",
    setting: { name: "FOLDER_ID", want: "folder", label: "Your practice folder's address",
      placeholder: "https://drive.google.com/drive/folders/…",
      manual: "Left the address box empty? Find the line `const FOLDER_ID = \"PASTE_THE_FOLDER_ID_HERE\"` and paste your folder's ID over the capital letters, keeping the quote marks. The ID is the long code after `folders/` in the folder's address; stop before any `?`." },
    before: [
      "A practice folder in Drive with two or three made-up Docs and one folder inside it. Point it at a real folder once you've seen it work."
    ],
    prompt: "Write a Google Apps Script that lists every file in one Google Drive folder and all of its subfolders in a new Google Sheet: one row per file, with the folder path, the file's title, its type in plain words (Doc, Sheet, Slides, PDF), its link, and when it last changed. Use only DriveApp and SpreadsheetApp. Put the folder ID in one clearly marked line at the top, and name the main function inventory. Then tell me, in plain language, what the first run will ask permission for and why.",
    allow: "This script only reads files and makes one new Sheet; it never deletes.",
    log: "N files listed. Open the inventory:",
    end: "A new Sheet in My Drive named “Inventory:” plus your folder's name, one row per file: its folder, title, type, link, and when it last changed.",
    breaking: [
      "Red text in the *Execution log*: copy it and paste it into your AI chat with “What went wrong?”",
      "Red text about permission or authorization: a box was probably left unticked on the permission screen. Press *Run* again and tick every box if it asks; if it doesn't ask, paste the red text into your AI chat with “What went wrong?”",
      "“Syntax error” on line 1: what you pasted is words, not code (the request to explain it, or the prompt). Copy the script itself, select everything in the editor, and paste again.",
      "“Unexpected error” or “not found”: the folder ID is wrong or incomplete. Paste the folder's address into the box in step 1 again, copy the script again, and paste it over the old one.",
      "A folder with thousands of files can take minutes and may stop before the end. Try a small folder first.",
      "“Not found” after pasting a script your AI changed: its settings line has the placeholder again. Put your ID back between the quotes, as in step 2."
    ]
  },
  multiplier: {
    name: "The Doc Multiplier",
    file: "recipes/doc-multiplier.gs",
    lives: "bound",
    fn: "multiply",
    setting: { name: "TEMPLATE_ID", want: "doc", label: "Your template Doc's address",
      placeholder: "https://docs.google.com/document/d/…/edit",
      manual: "Left the address box empty? Find the line `const TEMPLATE_ID = \"PASTE_THE_DOC_ID_HERE\"` and paste your Doc's ID over the capital letters, keeping the quote marks. The ID is the long code between `/d/` and `/edit` in the Doc's address." },
    before: [
      "A Doc to copy. Whatever is in it gets copied; a made-up team planning doc is fine.",
      "A Sheet whose first tab has a heading like “Team” in row 1 and one made-up name per row in column A, from row 2. Leave column B empty: the script writes each copy's link there, replacing anything in it. The script will live inside this Sheet."
    ],
    prompt: "Write a Google Apps Script that lives inside a Google Sheet (a bound script) and makes one copy of a template Google Doc for every row of the Sheet's first tab: row 1 is a heading, column A holds a name, each copy is named for its row and saved in one new folder, and each copy's link goes into column B of its row. Use only DriveApp and SpreadsheetApp, with getActiveSpreadsheet for the Sheet it lives in. Put the template Doc's ID in one clearly marked line at the top, and name the main function multiply. Then tell me, in plain language, what the first run will ask permission for and why.",
    allow: "This script reads your Doc and this Sheet, makes copies in one new folder, and writes their links into column B; it never deletes.",
    log: "N copies made. Open the folder:",
    end: "A new folder in My Drive named “Copies of” plus your Doc's name, one copy per row, each named for its row; and column B of your Sheet now holds a link to each copy. Run it again only if you want a second set.",
    breaking: [
      "Red text in the *Execution log*: copy it and paste it into your AI chat with “What went wrong?”",
      "Red text about permission or authorization: a box was probably left unticked on the permission screen. Press *Run* again and tick every box if it asks; if it doesn't ask, paste the red text into your AI chat with “What went wrong?”",
      "“Syntax error” on line 1: what you pasted is words, not code (the request to explain it, or the prompt). Copy the script itself, select everything in the editor, and paste again.",
      "“Cannot read properties of null”: the script isn't inside your Sheet. Open the Sheet, choose *Extensions*, then *Apps Script*, and paste it there.",
      "“Unexpected error” or “not found”: the Doc's ID is wrong or incomplete. Paste the Doc's address into the box in step 1 again, copy the script again, and paste it over the old one.",
      "Blank Docs with the right names: the Doc you pointed at is empty.",
      "“Not found” after pasting a script your AI changed: its settings line has the placeholder again. Put your ID back between the quotes, as in step 2."
    ]
  }
};
// In an AI chat, a script is something to read or copy, not a tool to run, so none of the three needs its setup step
const CODE_TIP = "Paste it and send. No Canvas or Preview needed: a script comes back as code to read and copy.";
// Where each kind of script goes in, said the same way in a kit's step 2 and in the sheet that opens after a copy
const SCRIPT_HOMES = {
  standalone: {
    paste: "Open [script.google.com](https://script.google.com/) and press *New project*. The project that opens is a file of its own in your Drive: a standalone script. Select everything in the editor, delete it, paste, and press the *Save* icon.",
    lead: "Now paste it into Apps Script, not your AI chat. It's code, and Apps Script is where it runs.",
    tool: { name: "Open script.google.com", url: "https://script.google.com/", tip: "Press New project, select everything in the editor, delete it, and paste." }
  },
  bound: {
    paste: "Open your Sheet and choose *Extensions*, then *Apps Script*. The project that opens lives inside the Sheet: a bound script. Select everything in the editor, delete it, paste, and press the *Save* icon.",
    lead: "Now paste it into Apps Script inside your Sheet, not your AI chat. It's code, and Apps Script is where it runs.",
    tool: { name: "Open Google Sheets", url: "https://sheets.google.com/", tip: "Open your Sheet, then Extensions › Apps Script. Select everything there, delete it, and paste." }
  }
};

// The level 3 scripts, each loaded once from its file (and up front, so a Copy click never waits:
// Safari refuses to copy after a wait)
const scriptCache = {};
async function loadKitScript(kit) {
  if (!scriptCache[kit.file]) {
    const response = await fetch(kit.file);
    if (!response.ok) throw new Error("Could not load " + kit.file);
    scriptCache[kit.file] = await response.text();
  }
  return scriptCache[kit.file];
}
document.querySelectorAll("[data-script-kit]").forEach((box) => { const kit = SCRIPT_KITS[box.dataset.scriptKit]; if (kit) loadKitScript(kit).catch(() => {}); });
function askFor(kit, code) {
  return 'Here is a Google Apps Script called "' + kit.name + '". ' +
    "First, explain what it does in plain language, line by line, and tell me exactly what permission the first run will ask for and why. " +
    "Then wait: I'll tell you what to change.\n\n```javascript\n" + code + "\n```";
}
// A remix line on a script card asks for a change to that script, so it carries the script with it: it works in any
// chat, whether or not the script was pasted there first
function changeFor(kit, change, code) {
  return 'Here is a Google Apps Script called "' + kit.name + '". Change it so that it does this: ' + change + "\n\n" +
    "Keep the line that starts with const " + kit.setting.name + " exactly as it is: I'll put my own value back in. " +
    "Give me the whole script back, ready to paste over the old one, then tell me which lines changed and whether the first run will ask for any new permission.\n\n```javascript\n" + code + "\n```";
}

// The steps' small markup, drawn as text nodes, code, strong, and links: never parsed as HTML
function richText(text) {
  const frag = document.createDocumentFragment();
  text.split(/(`[^`]+`|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/).forEach((part) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const a = linkTo(link[2], link[1]);
      if (/^https:/.test(link[2])) { a.className = "away"; a.target = "_blank"; a.rel = "noopener"; }
      frag.append(a);
    }
    else if (/^`.+`$/.test(part)) frag.append(el("code", "", part.slice(1, -1)));
    else if (/^\*.+\*$/.test(part)) frag.append(el("strong", "", part.slice(1, -1)));
    else if (part) frag.append(part);
  });
  return frag;
}


// ---------- Small helpers ----------

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function linkTo(href, text) {
  const a = el("a", "", text);
  a.href = href;
  return a;
}

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function remember(key, value) {
  try { localStorage.setItem(key, value); } catch { /* private window: no memory, no problem */ }
}

function recall(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

// The AI tool this visitor last picked, if any, remembered in this browser only
const TOOL_KEY = "hands-on-ai";


// ---------- Icons: the starters' badges and the awards, from assets/icons.js ----------

if (typeof iconSvg === "function") {
  document.querySelectorAll("[data-icon]").forEach((spot) => {
    spot.innerHTML = iconSvg(spot.dataset.icon);
    spot.setAttribute("aria-hidden", "true");
  });
}


// ---------- The menu on a phone: a button that opens the pages as rows ----------

document.querySelectorAll(".menu-toggle").forEach((button) => {
  const nav = $(button.getAttribute("aria-controls"));
  if (!nav) return;
  const setOpen = (open) => {
    button.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  };
  button.addEventListener("click", () => setOpen(button.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") { setOpen(false); button.focus(); }
  });
  document.addEventListener("click", (event) => {
    if (button.getAttribute("aria-expanded") === "true" && !event.target.closest(".site-head")) setOpen(false);
  });
});


// ---------- A link to a place inside a closed fold opens the fold ----------

function openTo(hash) {
  const target = hash && hash.length > 1 && document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;
  for (let node = target; node; node = node.parentElement) if (node.tagName === "DETAILS") node.open = true;
}
document.addEventListener("click", (event) => {
  const a = event.target.closest && event.target.closest('a[href^="#"]');
  if (a) openTo(a.hash);
});
addEventListener("hashchange", () => openTo(location.hash));
openTo(location.hash);

// A link from another page: the browser scrolls to its place before the fonts arrive and the now bar steps away,
// which moves everything above it. Once the page has settled, land there again, unless the visitor has started moving.
if (location.hash.length > 1) {
  let moved = false;
  ["wheel", "touchstart", "keydown", "mousedown"].forEach((type) => addEventListener(type, () => { moved = true; }, { once: true, passive: true }));
  addEventListener("load", () => document.fonts.ready.then(() => requestAnimationFrame(() => {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target && !moved && target.getClientRects().length) target.scrollIntoView({ block: "start", behavior: "instant" });
  })));
}


// ---------- The clock ----------
// Add ?now=10:50 to any page's address to see it as it will look at that moment on the day.

const segments = SESSION.segments.map((s) => ({ ...s, startMin: toMinutes(s.start), endMin: toMinutes(s.end) }));

function sessionNow() {
  const override = new URLSearchParams(location.search).get("now");
  if (override && /^\d{1,2}:\d{2}$/.test(override)) return { day: EVENT_DAY, minutes: toMinutes(override) };
  const parts = {};
  new Intl.DateTimeFormat("en-US", {
    timeZone: SESSION.timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(new Date()).forEach((p) => { parts[p.type] = p.value; });
  return { day: parts.year + "-" + parts.month + "-" + parts.day, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

// Before, during, or after the session, and which part we're in
function phase() {
  const { day, minutes } = sessionNow();
  const first = segments[0];
  const last = segments[segments.length - 1];
  if (day < EVENT_DAY || (day === EVENT_DAY && minutes < first.startMin)) return { mode: "before", today: day === EVENT_DAY };
  if (day > EVENT_DAY || minutes >= last.endMin) return { mode: "after" };
  return { mode: "during", index: segments.findIndex((s) => minutes >= s.startMin && minutes < s.endMin) };
}


// ---------- The morning, as a list (Home) ----------

// The shared spaces a part uses (the Breakout Planner, the walls), as links that open in a new tab
function sharedLinks(segment, className) {
  return (segment.shared || []).filter((s) => LINKS[s.link]).map((s) => {
    const a = linkTo(LINKS[s.link], s.label);
    a.className = (className ? className + " " : "") + "away";
    a.target = "_blank";
    a.rel = "noopener";
    return a;
  });
}

const timeline = $("timeline");
if (timeline) {
  segments.forEach((s) => {
    const li = el("li");
    const body = el("div");
    const title = el("strong", "", s.title);
    s.state = el("span", "sr-only", "");   // "(finished)" or "(happening now)" for screen readers
    title.append(s.state);
    body.append(title, el("span", "", s.hint));
    if (s.linkLabel) body.append(" ", linkTo(s.link, labelFor(s)));
    li.append(el("span", "length", s.minutes + " min"), body);
    s.item = li;
    timeline.append(li);
  });
}


// ---------- Now: the bar, the Home card, and the notice when things move on ----------

const nowLine = $("now");
let lastSegment = null;
const here = location.pathname.split("/").pop() || "index.html";

// The bar's line: a tag, then each piece in a span that keeps its separator with it, so a line never ends on "·"
function setNow(tag, ...pieces) {
  if (!nowLine) return;
  nowLine.replaceChildren();
  if (tag) nowLine.append(el("span", "tag", tag));
  const text = el("span", "now-text");
  pieces.forEach((piece, i) => {
    const wrap = el("span", piece.className === "upnext" ? "upnext" : "");
    if (i) wrap.append("· ");
    wrap.append(piece.className === "upnext" ? piece.textContent : piece);
    text.append(wrap, i < pieces.length - 1 ? " " : "");
  });
  nowLine.append(text);
}

function endWith(title) {
  return /[.?!]$/.test(title) ? title : title + ".";
}

// A part's button words. A part whose shared walls have no links yet says where they'll come from, instead of promising them.
function labelFor(segment) {
  const waiting = segment.linkLabelPending && (segment.shared || []).every((sh) => !SESSION.links[sh.link]);
  return waiting ? segment.linkLabelPending : segment.linkLabel;
}

// Where a part's button should go from this page: its own page, or, when that's the page you're on, down the page
function partLink(segment) {
  const [page, hash] = segment.link.split("#");
  const body = document.body.dataset;
  if (body.page === "hosts" && $("part-" + segment.id)) return { href: "#part-" + segment.id, label: "Go to this part" };
  if (page === here && !hash && body.jump) return { href: body.jump, label: body.jumpLabel || labelFor(segment) };
  if (page === here && hash) return { href: "#" + hash, label: labelFor(segment) };
  return { href: segment.link, label: labelFor(segment) };
}

// Meet can't send one message to every breakout room, so the page does it:
// when the morning moves on while this page is open, a line joins the now bar.
function showCue(segment) {
  const cue = $("cue");
  if (!cue) return;
  const to = partLink(segment);
  cue.hidden = false;
  $("cue-text").replaceChildren(el("strong", "", "Now: " + endWith(segment.title) + " "), segment.hint);
  $("cue-go").href = to.href;
  $("cue-go").textContent = to.label || "Take me there";
}
if ($("cue")) {
  $("cue-go").addEventListener("click", () => { $("cue").hidden = true; });
  $("cue-close").addEventListener("click", () => { $("cue").hidden = true; });
}

// What comes next is the session file's to say; with nothing there, the card stays away
document.querySelectorAll(".next").forEach((card) => { card.hidden = !SESSION.next; });

function showMode(mode) {
  document.body.dataset.mode = mode;
  document.querySelectorAll("details[data-open-during]").forEach((fold) => { if (mode === "during") fold.open = true; });
  document.querySelectorAll("[data-show]").forEach((section) => {
    section.hidden = !section.dataset.show.split(" ").includes(mode);
  });
}

function update() {
  const now = phase();
  showMode(now.mode);
  // After the session the site is a kit for anyone, so the bar that kept the morning's clock steps away
  const bar = document.querySelector(".nowbar");
  if (bar) bar.hidden = now.mode === "after";

  segments.forEach((s) => {
    if (!s.item) return;
    s.item.classList.remove("now", "done");
    s.item.removeAttribute("aria-current");
    s.state.textContent = "";
  });

  if (now.mode === "before") {
    const pieces = [el("span", "", now.today ? TIMES.fill("We start at {start} {zone}.") : SESSION.dateLabel)];
    if (now.today && here === "index.html") pieces.push(linkTo("#today", "See the plan"));
    setNow(now.today ? "Soon" : "", ...pieces);
    lastSegment = "before";
    return;
  }
  if (now.mode === "after") {
    segments.forEach((s) => {
      if (!s.item) return;
      s.item.classList.add("done");
      s.state.textContent = " (finished)";
    });
    lastSegment = "after";
    return;
  }

  const current = segments[now.index];
  const next = segments[now.index + 1];
  // Sections for a part that hasn't started, or has ended, wait or step away
  document.querySelectorAll("[data-from]").forEach((section) => {
    const from = segments.findIndex((s) => s.id === section.dataset.from);
    if (from !== now.index && !(section.dataset.stay && from < now.index)) section.hidden = true;
  });
  segments.forEach((s, i) => {
    if (!s.item) return;
    if (i < now.index) { s.item.classList.add("done"); s.state.textContent = " (finished)"; }
  });
  if (current.item) {
    current.item.classList.add("now");
    current.item.setAttribute("aria-current", "step");
    current.state.textContent = " (happening now)";
  }

  // The part's name, then its button's words as the link, so the link says where it goes
  const to = partLink(current);
  const pieces = to.label
    ? [el("span", "", current.title), linkTo(to.href, to.label)]
    : [linkTo(to.href, current.title)];
  if (next) pieces.push(el("span", "upnext", "Next: " + next.title));
  setNow("Now", ...pieces);

  // The big card on Home
  if ($("nowcard-title")) {
    $("nowcard-title").textContent = current.title;
    $("nowcard-where").textContent = "· " + current.where;
    $("nowcard-hint").textContent = current.hint;
    const go = $("nowcard-go");
    go.hidden = !current.linkLabel;
    if (current.linkLabel) { go.href = current.link; go.textContent = labelFor(current); }
    $("nowcard-also").replaceChildren(...(current.also || []).map((a) => { const link = linkTo(a.link, a.label); link.className = "button"; return link; }));
    $("nowcard-shared").replaceChildren(...sharedLinks(current, "button"));
    $("nowcard-next").textContent = next ? "Next: " + next.title + " · " + next.minutes + " min" : "Last part of the morning.";
  }

  if (lastSegment !== null && lastSegment !== now.index) showCue(current);
  lastSegment = now.index;
}

update();
setInterval(update, 15000);


// ---------- Shared links ----------

document.querySelectorAll(".link-slot").forEach((slot) => {
  const url = LINKS[slot.dataset.link];
  if (url) {
    const a = linkTo(url, TIMES.fill(slot.dataset.label));   // a label can be a {brace}: {license}
    a.className = (slot.dataset.style || "button primary") + (slot.dataset.link === "license" ? "" : " away");
    a.target = "_blank";
    a.rel = slot.dataset.link === "license" ? "license noopener" : "noopener";
    slot.append(a);
  } else if (slot.dataset.pending === "") {
    slot.hidden = true;   // the page has already said, in its own words, where the link comes from
  } else {
    slot.append(el("span", "pending", TIMES.fill(slot.dataset.pending || "The link is coming soon.")));
  }
});


// ---------- Three levels and Starters: one level at a time ----------
// Both pages carry the same level bar over the same three levels (#chat, #site, #script), and remember the last one
// opened in one place, so a level chosen on one page is the level the other opens on.
// The level bar sticks under the now bar. One level shows at a time; the others wait as hidden="until-found", so the
// browser's find-in-page still finds their words and opens the level they're in. A link to a level, or to a place
// inside one (a fold, a step), opens that level first, with a short crossfade where the browser has view transitions
// and the visitor hasn't asked for less motion. Back and forward follow; the level you last opened is remembered.
// Without scripts, every level shows, one after another.

const LEVEL_KEY = "first-builds-level";

document.querySelectorAll(".level-bar").forEach((bar) => {
  const nowbar = document.querySelector(".nowbar");
  // Its own place, and, for anything that sticks or scrolls to just below it, where the bar ends
  const place = () => {
    const top = nowbar && !nowbar.hidden && getComputedStyle(nowbar).position === "sticky" ? nowbar.offsetHeight : 0;
    bar.style.top = top + "px";
    document.documentElement.style.setProperty("--below-level-bar", top + bar.offsetHeight + "px");
  };
  place();
  addEventListener("resize", place);
  setInterval(place, 15000);

  const levels = [...document.querySelectorAll(".level-panel")];
  if (!levels.length) return;
  const levelOf = (hash) => {
    const target = hash && hash.length > 1 && document.getElementById(decodeURIComponent(hash.slice(1)));
    return target ? levels.find((level) => level.contains(target)) : null;
  };
  const show = (level) => {
    levels.forEach((l) => { if (l === level) l.removeAttribute("hidden"); else l.setAttribute("hidden", "until-found"); });
    // Every link to a level says which one is open: the bar, the comparison's cards, the back and next links
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      if (!levels.some((l) => a.hash === "#" + l.id)) return;
      if (a.hash === "#" + level.id) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
    // The comparison's card for the open level says so, instead of offering to open it again
    document.querySelectorAll(".compare-foot a").forEach((a) => {
      a.dataset.label = a.dataset.label || a.textContent;
      a.textContent = a.hasAttribute("aria-current") ? "Showing below" : a.dataset.label;
    });
    remember(LEVEL_KEY, level.id);
  };
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("click", (event) => {
    const a = event.target.closest && event.target.closest('a[href^="#"]');
    const level = a && levelOf(a.hash);
    if (!level || !level.hidden) return;   // already open: the browser scrolls there as usual
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;   // a new tab or window
    if (!document.startViewTransition || reduced()) { show(level); return; }   // then the browser scrolls to it
    event.preventDefault();
    document.startViewTransition(() => {
      show(level);
      history.pushState({ level: level.id }, "", a.hash);
      openTo(a.hash);
      document.getElementById(decodeURIComponent(a.hash.slice(1))).scrollIntoView({ block: "start", behavior: "instant" });
    });
  });
  // Back and forward: each step in the history knows the level it had open, or its address says
  const follow = (event) => {
    const id = event && event.state && event.state.level;
    const level = (id && document.getElementById(id)) || levelOf(location.hash);
    if (level && level.hidden) show(level);
  };
  addEventListener("hashchange", follow);
  addEventListener("popstate", follow);
  levels.forEach((level) => level.addEventListener("beforematch", () => show(level)));   // find-in-page found a word in it

  const first = levelOf(location.hash) || levels.find((l) => l.id === recall(LEVEL_KEY)) || levels[0];
  show(first);
  history.replaceState({ ...history.state, level: first.id }, "");
});


// ---------- A contents rail: a long page's "On this page" list, kept in view beside the content ----------
// On a screen wide enough to have room beside the reading column (site.css), the list also stands in the margin
// and marks the section you're in. It's built from the page's own list, so the two can't disagree; without
// scripts, or on a narrower screen, the list stays where it is.

document.querySelectorAll("nav.on-page").forEach((index) => {
  const main = document.querySelector("main");
  const source = index.querySelector("ul");
  if (!main || !source) return;
  const rail = el("nav", "page-rail");
  rail.setAttribute("aria-label", "On this page");
  const inner = el("div", "page-rail-inner");
  const list = source.cloneNode(true);
  inner.append(el("p", "label", "On this page"), list);
  rail.append(inner);
  main.prepend(rail);
  document.body.classList.add("has-rail");

  const links = [...list.querySelectorAll('a[href^="#"]')];
  const targets = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
  let queued = false;
  const mark = () => {
    queued = false;
    const line = (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + 96;
    let current = targets[0];
    targets.forEach((t) => { if (t.getBoundingClientRect().top <= line) current = t; });
    // At the very bottom, the last section is the one you're in, however short it is
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = targets[targets.length - 1];
    links.forEach((a) => { if (current && a.hash === "#" + current.id) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
  };
  addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(mark); } }, { passive: true });
  addEventListener("resize", mark);
  mark();
});


// ---------- Where do I paste it? One tool at a time, the visitor's own remembered ----------

document.querySelectorAll("[data-where]").forEach((box, n) => {
  const favorite = recall(TOOL_KEY);
  const tabs = el("div", "where-tabs");
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", "Your AI tool");
  const panels = el("div", "where-panels");
  const buttons = [];
  AI_TOOLS.forEach((tool, i) => {
    const id = "where-" + n + "-" + tool.id;
    const tab = el("button", "", tool.name);
    tab.type = "button";
    tab.id = id + "-tab";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", id);
    const panel = el("div", "where-panel");
    panel.id = id;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    panel.append(el("p", "", tool.where));
    if (box.dataset.where === "code") {
      const code = el("p", "");
      code.append(el("strong", "", "To copy the code out: "), tool.code);
      panel.append(code);
    }
    tabs.append(tab);
    panels.append(panel);
    buttons.push({ tab, panel, tool });
  });
  const select = (chosen, focus) => {
    buttons.forEach(({ tab, panel, tool }) => {
      const on = tool.id === chosen;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      panel.hidden = !on;
      if (on && focus) tab.focus();
    });
  };
  buttons.forEach(({ tab, tool }, i) => {
    tab.addEventListener("click", () => { select(tool.id); remember(TOOL_KEY, tool.id); });
    tab.addEventListener("keydown", (event) => {
      const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      const nextTool = buttons[(i + step + buttons.length) % buttons.length].tool;
      select(nextTool.id, true);
      remember(TOOL_KEY, nextTool.id);
    });
  });
  select(AI_TOOLS.some((t) => t.id === favorite) ? favorite : AI_TOOLS[0].id);
  const notes = el("ul", "where-notes");
  WHERE_NOTES.forEach((note) => notes.append(el("li", "", note)));
  box.replaceChildren(tabs, panels, notes);
});

// A step with lettered sub-steps and a stop note, or a plain one, as a list item
function stepItem(step) {
  const li = el("li");
  if (typeof step === "string") { li.append(richText(step)); return li; }
  li.append(richText(step.text));
  const sub = el("ol", "sub-steps");
  sub.type = "a";
  step.sub.forEach((text) => { const s2 = el("li"); s2.append(richText(text)); sub.append(s2); });
  li.append(sub);
  if (step.stop) { const stop = el("p", "stop-note"); stop.append(richText(step.stop)); li.append(stop); }
  return li;
}

// A copy well's first line: what the text is, and where it goes (the same line every copy well on the site starts with)
function copyKind(kind, where) {
  const icons = { Prompt: "message-square-text", Script: "code-xml", Message: "send" };
  const line = el("p", "copy-kind");
  const icon = el("span");
  if (typeof iconSvg === "function") { icon.innerHTML = iconSvg(icons[kind]); icon.setAttribute("aria-hidden", "true"); }
  line.append(icon, el("strong", "", kind), el("span", "", where));
  return line;
}

// The script kits: get the script (ours, with its settings line filled from an address; or a prompt for your AI to
// write one), paste it into Apps Script, run it and allow, and open what it made. Nothing typed in a kit is saved,
// and the address never goes to an AI: Copy for my AI to explain sends the script as written.
let kitCount = 0;
document.querySelectorAll("[data-script-kit]").forEach((box) => {
  const id = box.dataset.scriptKit;
  const kit = SCRIPT_KITS[id];
  if (!kit || typeof DRIVE_IDS === "undefined") return;
  const n = ++kitCount;
  const home = SCRIPT_HOMES[kit.lives];
  const guide = (here === "levels.html" ? "" : "levels.html") + "#permissions";
  let value = "";   // the ID read from the address box, when it holds one

  // 1. Get the script: ours, or a prompt for your AI, as two tabs (the choice is one or the other, never both)
  const ways = el("div", "ways");
  ways.setAttribute("role", "tablist");
  ways.setAttribute("aria-label", "Where the script comes from");
  const panels = [];
  const tabs = [["ours", "Use ours", "tested"], ["yours", "Have your AI write one", "a prompt"]].map(([key, label, note], i) => {
    const tab = el("button");
    tab.type = "button";
    tab.id = "kit-" + n + "-" + key + "-tab";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", "kit-" + n + "-" + key);
    tab.append(label, el("span", "way-note", note));
    ways.append(tab);
    const panel = el("div", "way");
    panel.id = "kit-" + n + "-" + key;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);
    panels.push(panel);
    return tab;
  });
  const choose = (i, focus) => {
    tabs.forEach((tab, j) => { tab.setAttribute("aria-selected", String(i === j)); tab.tabIndex = i === j ? 0 : -1; panels[j].hidden = i !== j; });
    if (focus) tabs[i].focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => choose(i));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      choose(1 - i, true);
    });
  });

  // Ours: the script itself, as code, with its settings line taking an address
  const well = el("div", "codewell");
  well.append(copyKind("Script", "code: paste it into Apps Script, not your AI chat"));
  const fileBar = el("p", "code-file");
  fileBar.append(el("span", "", kit.file.split("/").pop()), el("span", "code-lines", ""));
  const top = el("pre", "code-top");
  const setting = el("div", "code-setting");
  const field = el("input");
  field.type = "text";
  field.id = "kit-" + n + "-address";
  field.placeholder = kit.setting.placeholder;
  field.spellcheck = false;
  field.autocomplete = "off";
  field.setAttribute("autocapitalize", "off");
  const label = el("label", "", kit.setting.label);
  label.htmlFor = field.id;
  const line = el("div", "setting-line");
  line.append(el("code", "", "const " + kit.setting.name + " = \""), field, el("code", "", "\";"));
  const status = el("p", "setting-status");
  status.id = field.id + "-status";
  status.setAttribute("aria-live", "polite");
  field.setAttribute("aria-describedby", status.id);
  const idle = "Paste it here and the script carries its ID. Nothing you paste is saved or sent anywhere.";
  status.textContent = idle;
  setting.append(label, line, status);
  const rest = el("details", "code-rest");
  const restSummary = el("summary", "", "The rest of the script");
  const restCode = el("pre");
  rest.append(restSummary, restCode);
  well.append(fileBar, top, setting, rest);
  // A pasted address shrinks to the ID inside it, so the line shows exactly what the script will hold
  const whose = { folder: "the folder's", doc: "the Doc's", sheet: "the Sheet's" }[kit.setting.want];
  field.addEventListener("input", () => {
    const read = DRIVE_IDS.read(field.value, kit.setting.want);
    value = read.id || "";
    field.removeAttribute("aria-invalid");
    status.classList.toggle("is-found", !!read.id);
    if (read.assumed) {
      // Typed alone, or from an open?id= link, it can't say what it points at: taken, and said to be a guess
      status.classList.remove("is-found");
      status.textContent = "Taken as " + whose + " ID, but a long name can look like one too. Pasting the whole address from the bar at the top is surer.";
    } else if (read.id && field.value.trim() !== read.id) {
      field.value = read.id;
      status.textContent = "Found " + whose + " ID in that address: the part the script needs. It's in the script now, ready to copy.";
    } else {
      status.textContent = read.id ? "That's " + whose + " ID. It's in the script now, ready to copy." : read.problem || idle;
    }
  });
  // The script, cut at its settings line: what comes before it, the line itself (the box), and the rest, folded
  loadKitScript(kit).then((code) => {
    const lines = code.replace(/\n$/, "").split("\n");
    const at = lines.findIndex((l) => l.startsWith("const " + kit.setting.name));
    const after = lines.slice(at + 1);
    while (after.length && !after[0].trim()) after.shift();   // the blank line under the setting
    top.textContent = lines.slice(0, at).join("\n");
    restCode.textContent = after.join("\n");
    fileBar.lastChild.textContent = lines.length + " lines";
    restSummary.textContent = "The rest of the script: " + after.length + " more lines";
  }).catch(() => { top.textContent = "Couldn't load the script. Try opening the page from its web link."; });

  const copyScript = el("button", "primary", "Copy the script");
  copyScript.type = "button";
  copyScript.addEventListener("click", async () => {
    if (field.value.trim() && !value) {
      field.setAttribute("aria-invalid", "true");
      field.focus();
      return;
    }
    try {
      const code = DRIVE_IDS.fill(await loadKitScript(kit), { [kit.setting.name]: value });
      copyText(code, () => nextStep(kit.name + " script", copyScript, { lead: home.lead, tools: [home.tool] }), copyScript);
    } catch { say("Couldn't load that script. Try opening the page from its web link."); }
  });
  const askAI = el("button", "sm", "Copy for my AI to explain");
  askAI.type = "button";
  askAI.addEventListener("click", async () => {
    try {
      copyText(askFor(kit, await loadKitScript(kit)), () => nextStep(kit.name + " script, with a request to explain it", askAI, { aiTip: CODE_TIP }), askAI);
    } catch { say("Couldn't load that script. Try opening the page from its web link."); }
  });
  // The script, and the script with a request to explain it, go to different places, so their buttons stand apart
  const oursActions = el("div", "copy-actions");
  oursActions.append(copyScript);
  const explain = el("div", "kit-explain");
  explain.append(askAI, el("p", "copy-note", "Not sure what it does? This copies the script with a request to explain each line in plain words, and what the first run will ask permission for. It goes into your AI chat, not Apps Script, and your address stays here."));
  panels[0].append(well, oursActions, explain);

  // Yours: the prompt, as words for your AI, and what to do with the script that comes back
  const promptWell = el("div", "promptwell");
  promptWell.append(copyKind("Prompt", "words: paste them into your AI chat"), el("p", "prompt-text", kit.prompt));
  const copyPrompt = el("button", "primary", "Copy the prompt");
  copyPrompt.type = "button";
  copyPrompt.addEventListener("click", () => copyText(kit.prompt, () => nextStep("the prompt for " + kit.name, copyPrompt, {
    lead: "Now paste it into your AI chat. It answers with a script: copy that code, and go on to step 2.", aiTip: CODE_TIP
  }), copyPrompt));
  const yoursActions = el("div", "copy-actions");
  yoursActions.append(copyPrompt);
  const yoursNote = el("p", "copy-note");
  yoursNote.append(richText("Your AI answers with a script, which is code. Copy only the code, which comes in a box of its own with a copy button, not the words around it, and go on to step 2. Its script won't match ours line for line; the steps still fit, and its settings line wants the same ID. Ask it to explain anything you can't."));
  panels[1].append(promptWell, yoursActions, yoursNote);
  choose(0);

  // The four steps
  const stage = (title, ...parts) => {
    const li = el("li", "stage");
    li.append(el("h4", "stage-title", title), ...parts);
    return li;
  };
  const para = (text, className) => { const p = el("p", className || ""); p.append(richText(text)); return p; };
  const allow = permission(kit.allow);
  const runList = el("ul", "run-list");
  [ "In the toolbar, the menu beside *Run* and *Debug* shows a name: choose `" + kit.fn + "`. Press *Run*.", allow ]
    .forEach((step) => runList.append(stepItem(step)));
  const stages = el("ol", "stages");
  stages.append(
    stage("Get the script", ways, ...panels),
    stage("Paste it into Apps Script", para(home.paste), para(kit.setting.manual, "small")),
    stage("Run it, and allow", runList, para("[What you're allowing, and why](" + guide + ")", "small")),
    stage("Open what it made",
      para("When it finishes, a panel called *Execution log* opens below the code. Its last line is “" + kit.log + "” with a link. Click it."),
      para("*You'll know it worked:* " + kit.end))
  );

  const before = el("div", "kit-before");
  before.append(el("h4", "", "Before you start"));
  const beforeList = el("ul");
  kit.before.forEach((text) => beforeList.append(stepItem(text)));
  before.append(beforeList);

  const breaks = el("details", "kit-breaks");
  const breakList = el("ul");
  kit.breaking.forEach((text) => breakList.append(stepItem(text)));
  breaks.append(el("summary", "", "If it breaks"), breakList);

  const fold = el("details", "kit-fold");
  fold.open = "open" in box.dataset;
  const summary = el("summary");
  summary.append(el("span", "kit-open", "Set it up, step by step"), el("span", "count", "4 steps, from copying it to what it makes"));
  fold.append(summary, before, stages, breaks);
  box.replaceChildren(fold);
});


// ---------- Messages ----------
// A short page-level message at the foot of the window: errors and notices, not copy confirmations
// (a copy button says "Copied" itself). It stays long enough to read, and a tap or Esc sends it away.

function say(message) {
  const box = $("toast");
  if (!box) return;
  clearTimeout(box.hideTimer);
  box.classList.remove("show");
  box.textContent = "";   // clear first, so a repeated message is announced again
  setTimeout(() => {
    box.textContent = message;
    box.classList.add("show");
    box.hideTimer = setTimeout(() => box.classList.remove("show"), Math.min(6000, 3000 + message.length * 50));
  }, 60);
}
if ($("toast")) {
  const box = $("toast");
  box.addEventListener("mouseenter", () => clearTimeout(box.hideTimer));
  box.addEventListener("mouseleave", () => { box.hideTimer = setTimeout(() => box.classList.remove("show"), 2000); });
  box.addEventListener("click", () => box.classList.remove("show"));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") box.classList.remove("show"); });
}

// A quiet announcement for screen readers, for changes a button shows on its own face
const announcer = el("p", "sr-only");
announcer.setAttribute("role", "status");
announcer.setAttribute("aria-live", "polite");
document.body.append(announcer);
function announce(message) {
  announcer.textContent = "";
  setTimeout(() => { announcer.textContent = message; }, 60);
}

// The pressed button says it worked, for two seconds, at the same width
function markDone(button, label = "Copied") {
  if (!button) return;
  clearTimeout(button.doneTimer);
  if (!button.classList.contains("is-done")) {
    button.dataset.restore = button.textContent;
    button.style.minWidth = button.offsetWidth + "px";
  }
  button.classList.add("is-done");
  button.textContent = label;
  announce(label + ".");
  button.doneTimer = setTimeout(() => {
    button.classList.remove("is-done");
    button.textContent = button.dataset.restore;
    button.style.minWidth = "";
  }, 2000);
}


// ---------- The next step, after copying something for an AI ----------
// A sheet at the foot of the window: what was copied, then the three AI tools, each with the one setup step it
// needs, the visitor's last pick first. It waits for Done (people need it while they switch tabs).

let nextStepReturn = null;
function closeNextStep() {
  const panel = $("next-step");
  if (!panel || panel.hidden) return;
  panel.classList.add("leaving");
  setTimeout(() => { panel.hidden = true; panel.classList.remove("leaving"); document.body.style.paddingBottom = ""; }, 160);
  if (nextStepReturn && document.contains(nextStepReturn)) nextStepReturn.focus();
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && $("next-step") && !$("next-step").hidden && !document.querySelector("dialog[open]")) closeNextStep();
});

// options.lead: the sentence that says where it goes, when that isn't an AI chat (or says more than "paste it");
// options.tools: the places to open instead of the three AI tools (a script goes to Apps Script);
// options.aiTip: one tip for all three AI tools, when their usual setup step (Canvas, Preview) doesn't apply
function nextStep(what, trigger, options = {}) {
  let panel = $("next-step");
  const fresh = !panel || panel.hidden;
  if (!panel) {
    panel = el("div", "next-step");
    panel.id = "next-step";
    panel.setAttribute("role", "region");
    document.body.append(panel);
  }
  panel.dataset.dest = options.tools ? "elsewhere" : "ai";
  panel.setAttribute("aria-label", options.tools ? "Next: where to paste it" : "Next: paste it into your AI chat");
  nextStepReturn = trigger || nextStepReturn;
  const favorite = recall(TOOL_KEY);
  const tools = options.tools || [...AI_TOOLS].sort((a, b) => (b.id === favorite) - (a.id === favorite));
  const leadText = options.lead || "Now paste it into your AI chat.";
  const inner = el("div", "next-step-inner");
  const lead = el("p", "next-step-lead", leadText + (options.tools ? "" : " Not open yet?"));
  lead.tabIndex = -1;
  inner.append(el("p", "next-step-status", "Copied · " + what), lead);
  const row = el("div", "next-step-tools");
  tools.forEach((tool) => {
    const ai = !options.tools;
    const a = linkTo(tool.url, ai ? "Open " + tool.name + (tool.id === favorite ? " (your pick)" : "") : tool.name);
    a.className = "button away" + ((ai ? tool.id === favorite : tools.length === 1) ? " primary" : "");
    a.target = "_blank";
    a.rel = "noopener";
    if (ai) a.addEventListener("click", () => remember(TOOL_KEY, tool.id));
    const item = el("div", "next-step-tool");
    item.append(a, el("span", "", (ai && options.aiTip) || tool.tip));
    row.append(item);
  });
  const close = el("button", "next-step-close sm", "Done");
  close.type = "button";
  close.addEventListener("click", closeNextStep);
  inner.append(row, close);
  panel.replaceChildren(inner);
  if (fresh) {
    panel.classList.remove("leaving");
    panel.hidden = false;
    panel.style.animation = "none";
    void panel.offsetWidth;   // restart the entrance
    panel.style.animation = "";
  }
  announce("Copied " + what + ". " + leadText);
  lead.focus({ preventScroll: true });
  // The sheet never covers the row you pressed: room at the page's foot, and the row scrolled above the sheet
  document.body.style.paddingBottom = panel.offsetHeight + "px";
  const pressed = trigger && trigger.closest(".actions, .card-actions, .copy-actions, .builder") || trigger;
  if (pressed && document.contains(pressed)) {
    const clear = innerHeight - panel.offsetHeight - 16;
    const bottom = pressed.getBoundingClientRect().bottom;
    if (bottom > clear) window.scrollBy({ top: bottom - clear, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
}


// ---------- Copying: the modern way, then the older way, then by hand ----------

function olderCopy(text) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
  (document.querySelector("dialog[open]") || document.body).appendChild(area);
  area.select();
  let copied = false;
  try { copied = document.execCommand("copy"); } catch { copied = false; }
  area.remove();
  return copied;
}

function copyByHand(text) {
  const box = $("fallback");
  if (!box) return;
  const touch = matchMedia("(pointer: coarse)").matches;
  $("fallback-how").textContent = touch
    ? "Your browser blocked the copy button. Press and hold in the box, then choose Select all, then Copy."
    : "Your browser blocked the copy button. The text below is selected: press Ctrl+C (⌘C on a Mac) to copy it.";
  $("fallback-text").value = text;
  box.showModal();
  $("fallback-text").focus();
  $("fallback-text").select();
}
if ($("fallback")) {
  $("fallback-close").addEventListener("click", () => $("fallback").close());
  $("fallback-select").addEventListener("click", () => { $("fallback-text").focus(); $("fallback-text").select(); });
}

// done: what to do once it's copied (a function, such as the next-step sheet); button: the one pressed, which says "Copied"
function copyText(text, done, button) {
  const finish = () => { markDone(button); if (typeof done === "function") done(); };
  const tryOlder = () => (olderCopy(text) ? finish() : copyByHand(text));
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(finish, tryOlder);
  } else {
    tryOlder();
  }
}


// ---------- Starters ----------

const codeCache = {};
async function loadCode(id) {
  if (!codeCache[id]) {
    const response = await fetch(MACHINES[id].file);
    if (!response.ok) throw new Error("Could not load " + MACHINES[id].file);
    codeCache[id] = await response.text();
  }
  return codeCache[id];
}

// Load every starter up front, so a Copy click never has to wait
// (some browsers, Safari especially, refuse to copy after a wait).
if (document.querySelector("[data-play], [data-copy-machine]")) {
  Object.keys(MACHINES).forEach((id) => loadCode(id).catch(() => {}));
}

function promptFor(id, code) {
  return 'Here is the code for a small web app called "' + MACHINES[id].name + '". ' +
    "Please run it as a live preview I can play with (in Canvas, as an artifact, or with Preview). " +
    "Don't change anything yet. I'll ask for changes next.\n\n" +
    "```html\n" + code + "\n```";
}

async function copyMachine(id, button) {
  const done = () => nextStep(MACHINES[id].name, button);
  if (codeCache[id]) return copyText(promptFor(id, codeCache[id]), done, button);
  try {
    copyText(promptFor(id, await loadCode(id)), done, button);
  } catch {
    say("Couldn't load that starter. Try opening the page from its web link.");
  }
}

document.querySelectorAll("[data-copy-machine]").forEach((button) => {
  button.addEventListener("click", () => copyMachine(button.dataset.copyMachine, button));
});


// ---------- Remix menus, copy boxes, and the builder on Invent your own ----------

// A Remix menu says how many changes it holds, and each blank to fill shows as a blank that never splits from its comma
document.querySelectorAll(".remix").forEach((menu) => {
  const n = menu.querySelectorAll("li:not(.do)").length;
  const summary = menu.querySelector("summary");
  if (n && summary) summary.append(el("span", "count", "· " + n + " changes"));
});
document.querySelectorAll(".remix li:not(.do) > span").forEach((line) => {
  const text = line.firstChild;
  if (!text || text.nodeType !== 3 || !text.textContent.includes("___")) return;
  const frag = document.createDocumentFragment();
  text.textContent.split(/(___[.,:;?]?)/).forEach((part) => frag.append(/^___/.test(part) ? el("span", "slot", part) : part));
  line.replaceChild(frag, text);
});

document.querySelectorAll(".remix li:not(.do)").forEach((item) => {
  const line = item.querySelector("span").cloneNode(true);
  line.querySelectorAll(".note").forEach((note) => note.remove());   // a line's explanatory note isn't part of what's copied
  const text = line.textContent.trim();
  const button = el("button", "", "Copy");
  button.type = "button";
  button.setAttribute("aria-label", "Copy: " + text);
  // After a copy, one line under it says where it goes: a remix line means something only to the chat that has the starter
  const kit = SCRIPT_KITS[item.closest("[data-kit]")?.dataset.kit];
  const copied = (said) => () => {
    let hint = item.querySelector(".remix-hint");
    if (!hint) { hint = el("span", "remix-hint"); item.append(hint); }
    hint.textContent = said;
    announce(said);
    clearTimeout(hint.timer);
    hint.timer = setTimeout(() => hint.remove(), 6000);
  };
  button.addEventListener("click", async () => {
    if (!kit) {
      if ($("next-step") && !$("next-step").hidden && $("next-step").dataset.dest !== "ai") closeNextStep();   // a script's sheet would say the opposite
      return copyText(text, copied("Copied. Paste it into the same chat as your starter."), button);
    }
    try {
      copyText(changeFor(kit, text, await loadKitScript(kit)), () => nextStep("a change to " + kit.name + ", with the script", button, {
        lead: "Now paste it into your AI chat. Paste the script it gives back over the old one in Apps Script, and put your ID back on its settings line.",
        aiTip: CODE_TIP
      }), button);
    } catch { say("Couldn't load that script. Try opening the page from its web link."); }
  });
  item.appendChild(button);
});

document.querySelectorAll("[data-copy-from]").forEach((button) => {
  const source = $(button.dataset.copyFrom);
  button.setAttribute("aria-label", button.textContent.trim() + ": " + source.textContent.trim().slice(0, 80));
  button.addEventListener("click", () => copyText(source.textContent.trim(), null, button));
});

// Invent your own: three short answers become a request for an AI; an idea from the jar fills the three in,
// so the visitor sees it and can change it before copying. An empty answer is marked where it is, not in a message.
if ($("idea-out")) {
  const fields = ["idea-what", "idea-who", "idea-does"].map($);
  const blanks = ["what it is", "who it's for", "what it does"];
  const values = () => fields.map((f) => f.value.trim());
  const request = () => {
    const [what, who, does] = values();
    return "Build me a small web app: " + what + " for " + who + ". It should " + does + ". Make it simple, colorful, and fun to use. Use made-up data.";
  };
  const render = () => {
    const v = values();
    const part = (i) => v[i] ? document.createTextNode(v[i]) : el("span", "blank", blanks[i]);
    $("idea-out").replaceChildren("Build me a small web app: ", part(0), " for ", part(1), ". It should ", part(2),
      ". Make it simple, colorful, and fun to use. Use made-up data.");
    $("idea-label").textContent = v.every(Boolean) ? "Your request, ready to paste:" : "Your request so far:";
  };
  // The third answer's box grows with what's in it, so a long answer is never cut off mid-line
  const fit = () => { const box = fields[2]; box.style.height = "auto"; box.style.height = box.scrollHeight + 2 + "px"; };
  const clearErrors = () => { fields.forEach((f) => { f.removeAttribute("aria-invalid"); f.removeAttribute("aria-describedby"); }); $("idea-error").textContent = ""; };
  fields.forEach((f) => f.addEventListener("input", () => {
    f.removeAttribute("aria-invalid");
    f.removeAttribute("aria-describedby");
    if (!fields.some((x) => x.getAttribute("aria-invalid"))) $("idea-error").textContent = "";
    $("idea-status").textContent = "";
    render();
    fit();
  }));
  render();
  fit();
  $("idea-copy").addEventListener("click", () => {
    const empty = fields.filter((f) => !f.value.trim());
    if (empty.length) {
      // The message sits at the top of the three answers, and each empty one says so beside its label
      empty.forEach((f) => { f.setAttribute("aria-invalid", "true"); f.setAttribute("aria-describedby", "idea-error"); });
      $("idea-status").textContent = "";
      $("idea-error").textContent = empty.length === 3 ? "Answer the three questions first, or take an idea from the jar." : "Answer " + (empty.length === 1 ? "the question marked below" : "the questions marked below") + " first.";
      $("builder").scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      empty[0].focus({ preventScroll: true });
      return;
    }
    copyText(request(), () => nextStep("your request", $("idea-copy")), $("idea-copy"));
  });
  document.querySelectorAll("[data-idea]").forEach((button) => {
    button.setAttribute("aria-describedby", "jar-hint");
    button.addEventListener("click", () => {
      button.dataset.idea.split("|").forEach((answer, i) => { fields[i].value = answer; });
      clearErrors();
      render();
      fit();
      $("idea-status").textContent = "From the jar: " + button.textContent.trim() + ". Change anything you like.";
      $("builder").scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      fields[0].focus({ preventScroll: true });
    });
  });
}


// ---------- The Play window: play it, look inside, change it ----------

if ($("room")) {
  const room = $("room");
  const screen = $("screen");
  const frame = $("room-frame");
  const codePane = $("code-pane");
  const codeBox = $("code");
  const toggleCode = $("toggle-code");
  const status = $("room-status");
  let currentId = null;
  let undoText = null;
  let statusTimer;

  // The bar above the tool says what's running: the original, or your version (and Copy for my AI copies it)
  let mine = false;   // the frame is running edited code
  const showBar = () => {
    $("reset").hidden = !mine;
    $("room-bar").hidden = !mine && !status.textContent;
    $("room-playing").textContent = mine ? "Playing your version of" : "Playing";
  };
  const setStatus = (message, ms = 3000) => {
    clearTimeout(statusTimer);
    status.replaceChildren(message);
    showBar();
    if (ms) statusTimer = setTimeout(() => { status.replaceChildren(mine ? "Your version is running. Copy for my AI copies it." : ""); showBar(); }, ms);
  };

  // Show the code beside the tool (a laptop), or as its own tab (a phone)
  const showCode = (show) => {
    codePane.hidden = !show;
    $("room-body").classList.toggle("with-code", show);
    toggleCode.setAttribute("aria-expanded", String(show));
    toggleCode.textContent = show ? "Hide the code" : "Show the code";
    $("tab-tool").setAttribute("aria-selected", String(!show));
    $("tab-code").setAttribute("aria-selected", String(show));
    $("tab-tool").tabIndex = show ? -1 : 0;
    $("tab-code").tabIndex = show ? 0 : -1;
  };

  // The frame fades in when the starter has painted, over a line that says which one is starting
  const run = (code) => {
    screen.classList.remove("ready");
    screen.srcdoc = code;
  };
  screen.addEventListener("load", () => { if (screen.srcdoc) screen.classList.add("ready"); });

  const openRoom = async (id) => {
    try {
      const code = await loadCode(id);
      currentId = id;
      undoText = null;
      $("room-name").textContent = MACHINES[id].name;
      screen.title = MACHINES[id].name + ", running";
      frame.dataset.starting = "Starting " + MACHINES[id].name + "…";
      codeBox.value = code;
      mine = false;
      status.replaceChildren();
      showBar();
      showCode(false);
      run(code);
      room.showModal();
    } catch {
      say("Couldn't load that starter. Try opening the page from its web link.");
    }
  };

  document.querySelectorAll("[data-play]").forEach((button) => {
    button.addEventListener("click", () => openRoom(button.dataset.play));
  });
  // A starter's picture opens it too, for a mouse or a finger. It presses the card's Play button, so closing the
  // window returns focus there, the way in from a keyboard.
  document.querySelectorAll("[data-shot]").forEach((shot) => {
    shot.addEventListener("click", () => document.querySelector('[data-play="' + shot.dataset.shot + '"]').click());
  });
  toggleCode.addEventListener("click", () => showCode(codePane.hidden));
  $("tab-tool").addEventListener("click", () => showCode(false));
  $("tab-code").addEventListener("click", () => showCode(true));
  [$("tab-tool"), $("tab-code")].forEach((tab) => tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    showCode(tab.id === "tab-tool");
    (tab.id === "tab-tool" ? $("tab-code") : $("tab-tool")).focus();
  }));

  $("run").addEventListener("click", () => {
    run(codeBox.value);
    mine = codeBox.value !== codeCache[currentId];
    if (matchMedia("(max-width: 760px)").matches) showCode(false);   // on a phone, show what changed
    setStatus(mine ? "Your version is running. Copy for my AI copies it." : "Running the original: nothing has changed yet.", mine ? 0 : 3000);
  });
  $("reset").addEventListener("click", () => {
    undoText = codeBox.value;
    codeBox.value = codeCache[currentId];
    mine = false;
    run(codeBox.value);
    const undo = el("button", "sm", "Undo");
    undo.type = "button";
    undo.addEventListener("click", () => {
      codeBox.value = undoText;
      mine = true;
      run(undoText);
      setStatus("Your changes are back, and running. Copy for my AI copies them.", 0);
    });
    const line = el("span");
    line.append("Back to the original. ", undo);
    setStatus(line, 8000);
  });
  $("room-copy").addEventListener("click", () => {
    const edited = codeBox.value !== codeCache[currentId];
    copyText(promptFor(currentId, codeBox.value), () => {
      room.close();
      nextStep(edited ? "your version of " + MACHINES[currentId].name : MACHINES[currentId].name, document.querySelector('[data-play="' + currentId + '"]'));
    }, $("room-copy"));
  });
  $("room-close").addEventListener("click", () => room.close());
  room.addEventListener("close", () => {
    screen.srcdoc = "";
    screen.classList.remove("ready");
    const opener = document.querySelector('[data-play="' + currentId + '"]');
    if (opener && !$("next-step")?.matches(":not([hidden])")) opener.focus();
  });
}
