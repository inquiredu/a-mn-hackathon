// First Builds: the script shared by Home, Starters, Grant a wish, and Hosts.
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

// Level 3: scripts for Apps Script, shown and copied from one file each
const SCRIPTS = {
  inventory: { name: "The Drive Inventory", file: "recipes/drive-inventory.gs" },
  multiplier: { name: "The Doc Multiplier", file: "recipes/doc-multiplier.gs" }
};

// The AI tools people paste into: one source for the "next step" panel and for every page's
// "Where do I paste it?" block (<div data-where></div>). tip: the one move before pasting, for the panel.
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


// Level 3: the scripts' steps, written once for Starters and Three levels (<div data-steps="inventory"></div>).
// Every step names its place; the permission screen is described as Google shows it.
const PERMISSION = "The first run asks permission. A box says the project needs your permission: press Review permissions and choose your school account. Google may then say it hasn't verified this app, because you just wrote it: press Advanced, then the link that starts \"Go to\" (it may end in \"(unsafe)\"; that's Google's word for any script it hasn't reviewed, including your own). Then it asks to see, edit, create, and delete your Google Drive files and your Sheets. That's Google's standard wording for any script that touches Drive. ";
const BLOCKED = "If you see \"blocked by your administrator\" instead, your district doesn't allow scripts; stop there and ask your technology office.";
const SCRIPT_STEPS = {
  inventory: {
    kind: "A script, not a page: it runs in Google Apps Script, inside your Google account, and does a job in your Drive. Nothing to play. About an hour the first time, fifteen minutes after that.",
    before: [
      "A practice folder in Drive with two or three made-up Docs and one folder inside it. Point it at a real folder once you've seen it work."
    ],
    steps: [
      "Press Copy the script.",
      "Go to script.google.com and press New project. A project is a file in your Drive that holds a script. Select everything in the editing area, delete it, and paste.",
      "Open your practice folder in Drive and look at the address bar: drive.google.com/drive/folders/1AbC…xyz. Copy the letters and numbers after folders/ and stop before any ?. In the script, find the line const FOLDER_ID = \"PASTE_THE_FOLDER_ID_HERE\" and paste over the capital letters, keeping the quote marks.",
      "Press the Save icon. In the toolbar, the menu beside Run and Debug shows a name: choose inventory. Press Run.",
      PERMISSION + "This script only reads files and makes one new Sheet; it never deletes. Press Allow. " + BLOCKED,
      "When it finishes, a panel called Execution log opens below the code. Its last line is \"N files listed. Open the inventory:\" with a link. Click it."
    ],
    end: "A new Sheet in My Drive named \"Inventory:\" plus your folder's name, one row per file: its folder, title, type, link, and when it last changed.",
    breaking: [
      "Red text in the Execution log: copy it and paste it into your AI chat with \"What went wrong?\"",
      "\"Unexpected error\" or \"not found\": the folder ID is wrong or incomplete. Copy it again, stopping before any ?.",
      "A folder with thousands of files can take minutes and may stop before the end. Try a small folder first."
    ]
  },
  multiplier: {
    kind: "A script, not a page: it runs in Google Apps Script, inside your Google account, and makes Docs in your Drive. Nothing to play. About an hour the first time, fifteen minutes after that.",
    before: [
      "A Doc to copy. Whatever is in it gets copied; a made-up team planning doc is fine.",
      "A Sheet whose first tab has one made-up name per row in column A, starting in row 2, with a heading like \"Team\" in row 1. Leave column B empty: the script writes each copy's link there, replacing anything in it."
    ],
    steps: [
      "Press Copy the script.",
      "Go to script.google.com and press New project. A project is a file in your Drive that holds a script. Select everything in the editing area, delete it, and paste.",
      "Open your Doc and look at the address bar: docs.google.com/document/d/1AbC…xyz/edit. Copy the letters and numbers between /d/ and /edit. In the script, find const TEMPLATE_ID = \"PASTE_THE_DOC_ID_HERE\" and paste over the capital letters, keeping the quote marks. Do the same for your Sheet on the SHEET_ID line; its ID sits between /d/ and /edit in the same way.",
      "Press the Save icon. In the toolbar, the menu beside Run and Debug shows a name: choose multiply. Press Run.",
      PERMISSION + "This script reads your Doc and Sheet and makes copies in one new folder; it never deletes. Press Allow. " + BLOCKED,
      "When it finishes, a panel called Execution log opens below the code. Its last line is \"N copies made. Open the folder:\" with a link. Click it."
    ],
    end: "A new folder in My Drive named \"Copies of\" plus your Doc's name, one copy per row, each named for its row; and column B of your Sheet now holds a link to each copy. Run it again only if you want a second set.",
    breaking: [
      "Red text in the Execution log: copy it and paste it into your AI chat with \"What went wrong?\"",
      "\"Unexpected error\" or \"not found\": an ID is wrong or incomplete. Copy it again, stopping before /edit.",
      "Blank Docs with the right names: the Doc you pointed at is empty, or you pasted the Sheet's ID on the Doc's line."
    ]
  }
};


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


// ---------- Icons: the starters' badges and the awards (Home, Starters), from assets/icons.js ----------

if (typeof iconSvg === "function") {
  document.querySelectorAll("[data-icon]").forEach((spot) => {
    spot.innerHTML = iconSvg(spot.dataset.icon);
    spot.setAttribute("aria-hidden", "true");
  });
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

// The shared spaces a part uses (the Breakout Planner, the walls), as links that open in a new tab, for the Happening now card
function sharedLinks(segment, className) {
  return (segment.shared || []).filter((s) => LINKS[s.link]).map((s) => {
    const a = linkTo(LINKS[s.link], s.label);
    if (className) a.className = className;
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
    if (s.linkLabel) body.append(" ", linkTo(s.link, s.linkLabel));
    li.append(el("span", "length", s.minutes + " min"), body);
    s.item = li;
    timeline.append(li);
  });
}


// ---------- Now: the bar, the Home card, and the notice when things move on ----------

const nowLine = $("now");
let lastSegment = null;

function setNow(tag, ...pieces) {
  if (!nowLine) return;
  nowLine.replaceChildren();
  if (tag) nowLine.append(el("span", "tag", tag), " ");
  pieces.forEach((piece) => nowLine.append(piece));
}

function endWith(title) {
  return /[.?!]$/.test(title) ? title : title + ".";
}

// Meet can't send one message to every breakout room, so the page does it:
// when the morning moves on while this page is open, a notice slides in.
function showCue(segment) {
  const cue = $("cue");
  if (!cue) return;
  const lead = el("strong", "", "Now: " + endWith(segment.title) + " ");
  cue.hidden = false;
  $("cue-text").replaceChildren(lead, segment.hint);
  $("cue-go").href = segment.link;
}
if ($("cue")) {
  $("cue-go").addEventListener("click", () => { $("cue").hidden = true; });
  $("cue-close").addEventListener("click", () => { $("cue").hidden = true; });
}

// What comes next is the session file's to say; with nothing there, the card stays away
document.querySelectorAll(".next").forEach((card) => { card.hidden = !SESSION.next; });

function showMode(mode) {
  document.body.dataset.mode = mode;
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
    setNow(now.today ? "Soon" : "", now.today ? TIMES.fill("We start at {start} {zone}. ") : SESSION.dateLabel);
    if (now.today && nowLine) nowLine.append(linkTo("index.html#today", "See the plan"));
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
  // Sections for a later part (Show & Cheer, the close) wait until that part starts
  document.querySelectorAll("[data-from]").forEach((section) => {
    const from = segments.findIndex((s) => s.id === section.dataset.from);
    if (from > now.index) section.hidden = true;
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
  const pieces = current.linkLabel
    ? [el("span", "", current.title), " · ", linkTo(current.link, current.linkLabel)]
    : [linkTo(current.link, current.title)];
  if (next) pieces.push(el("span", "upnext", " · Next: " + next.title));
  setNow("Now", ...pieces);

  // The big card on Home
  if ($("nowcard-title")) {
    $("nowcard-title").textContent = current.title;
    $("nowcard-where").textContent = "· " + current.where;
    $("nowcard-hint").textContent = current.hint;
    const go = $("nowcard-go");
    go.hidden = !current.linkLabel;
    if (current.linkLabel) { go.href = current.link; go.textContent = current.linkLabel; }
    $("nowcard-shared").replaceChildren(...sharedLinks(current, "button"));
    $("nowcard-next").textContent = next ? "Next: " + next.title + ", " + next.minutes + " min" : "Last part of the morning.";
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
    a.className = slot.dataset.style || "button primary";
    a.target = "_blank";
    a.rel = slot.dataset.link === "license" ? "license noopener" : "noopener";
    slot.append(a);
  } else {
    slot.append(el("span", "pending", TIMES.fill(slot.dataset.pending || "The link is coming soon.")));
  }
});


// ---------- Where do I paste it? and the script steps, filled from the lists at the top ----------

document.querySelectorAll("[data-where]").forEach((box) => {
  const grid = el("div", "tips");
  AI_TOOLS.forEach((tool) => {
    const item = el("div");
    item.append(el("h4", "", tool.name), el("p", "", tool.where));
    if (box.dataset.where === "code") item.append(el("p", "", "To copy the code out: " + tool.code));
    grid.append(item);
  });
  const notes = el("ul", "where-notes");
  WHERE_NOTES.forEach((note) => notes.append(el("li", "", note)));
  box.replaceChildren(grid, notes);
});

document.querySelectorAll("[data-steps]").forEach((box) => {
  const plan = SCRIPT_STEPS[box.dataset.steps];
  if (!plan) return;
  const list = (items, tag) => { const l = el(tag); items.forEach((text) => l.append(el("li", "", text))); return l; };
  box.replaceChildren(
    el("p", "kind", plan.kind),
    el("h5", "", "Before you start"), list(plan.before, "ul"),
    el("h5", "", "Steps"), list(plan.steps, "ol"),
    el("h5", "", "You'll know it worked"), el("p", "", plan.end),
    el("h5", "", "If it breaks"), list(plan.breaking, "ul")
  );
});


// ---------- Messages ----------
// Inside the machine room, messages show in the room; everywhere else, at the bottom of the page.

function say(message) {
  const box = document.querySelector("dialog[open] .toast") || $("toast");
  if (!box) return;
  clearTimeout(box.hideTimer);
  box.textContent = "";   // clear first, so a repeated message is announced again
  setTimeout(() => {
    box.textContent = message;
    box.classList.add("show");
    box.hideTimer = setTimeout(() => box.classList.remove("show"), 7000);
  }, 60);
}
document.querySelectorAll(".toast").forEach((box) => {
  box.addEventListener("mouseenter", () => clearTimeout(box.hideTimer));
  box.addEventListener("mouseleave", () => {
    box.hideTimer = setTimeout(() => box.classList.remove("show"), 2500);
  });
});


// ---------- The next step, after copying something for an AI ----------
// Offers the three AI tools, with the one setup step each needs, and remembers the one you pick.

function nextStep(message) {
  let panel = $("next-step");
  if (!panel) {
    panel = el("div", "next-step");
    panel.id = "next-step";
    panel.setAttribute("role", "status");
    document.body.append(panel);
  }
  const favorite = recall("hands-on-ai");
  const tools = [...AI_TOOLS].sort((a, b) => (b.id === favorite) - (a.id === favorite));
  const inner = el("div", "next-step-inner");
  inner.append(el("p", "next-step-lead", message + " Now paste it into your AI chat. Not open yet?"));
  const row = el("div", "next-step-tools");
  tools.forEach((tool) => {
    const a = linkTo(tool.url, "Open " + tool.name + (tool.id === favorite ? " (your pick)" : ""));
    a.className = "button" + (tool.id === favorite ? " primary" : "");
    a.target = "_blank";
    a.rel = "noopener";
    a.addEventListener("click", () => remember("hands-on-ai", tool.id));
    const item = el("div", "next-step-tool");
    item.append(a, el("span", "", tool.tip));
    row.append(item);
  });
  const close = el("button", "next-step-close", "Done");
  close.type = "button";
  close.addEventListener("click", () => { panel.hidden = true; });
  inner.append(row, close);
  panel.replaceChildren(inner);
  panel.hidden = false;
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
  $("fallback-text").value = text;
  box.showModal();
  $("fallback-text").focus();
  $("fallback-text").select();
}

// done: what to do once it's copied (show a message, or the next-step panel)
function copyText(text, done) {
  const finish = typeof done === "function" ? done : () => say(done);
  const tryOlder = () => (olderCopy(text) ? finish() : copyByHand(text));
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(finish, tryOlder);
  } else {
    tryOlder();
  }
}
if ($("fallback-close")) $("fallback-close").addEventListener("click", () => $("fallback").close());


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

async function copyMachine(id) {
  const done = () => nextStep("Copied " + MACHINES[id].name + ".");
  if (codeCache[id]) return copyText(promptFor(id, codeCache[id]), done);
  try {
    copyText(promptFor(id, await loadCode(id)), done);
  } catch {
    say("Couldn't load that starter. Try opening the page from its web link.");
  }
}

document.querySelectorAll("[data-copy-machine]").forEach((button) => {
  button.addEventListener("click", () => copyMachine(button.dataset.copyMachine));
});


// ---------- Remix menus, copy boxes, the wish jar, and the wish builder ----------

document.querySelectorAll(".remix li:not(.do)").forEach((item) => {
  const text = item.querySelector("span").firstChild.textContent.trim();
  const button = el("button", "", "Copy");
  button.type = "button";
  button.setAttribute("aria-label", "Copy: " + text);
  button.addEventListener("click", () => copyText(text, "Copied. Paste it into the same AI chat."));
  item.appendChild(button);
});

// A script box: <pre data-script="inventory"> fills from its file; data-copy-script and
// data-ask-script copy the script, or the script with a question for the AI
const scriptCache = {};
async function loadScript(id) {
  if (!scriptCache[id]) {
    const response = await fetch(SCRIPTS[id].file);
    if (!response.ok) throw new Error("Could not load " + SCRIPTS[id].file);
    scriptCache[id] = await response.text();
  }
  return scriptCache[id];
}
function askFor(id, code) {
  return 'Here is a Google Apps Script called "' + SCRIPTS[id].name + '". ' +
    "First, explain what it does in plain language, line by line, and tell me exactly what permission the first run will ask for and why. " +
    "Then wait: I'll tell you what to change.\n\n```javascript\n" + code + "\n```";
}
document.querySelectorAll("[data-script]").forEach((box) => {
  loadScript(box.dataset.script).then((code) => { box.textContent = code; }).catch(() => { box.textContent = "Couldn't load the script. Try opening the page from its web link."; });
});
if (document.querySelector("[data-copy-script], [data-ask-script]")) {
  Object.keys(SCRIPTS).forEach((id) => loadScript(id).catch(() => {}));
}
document.querySelectorAll("[data-copy-script], [data-ask-script]").forEach((button) => {
  const ask = "askScript" in button.dataset;
  const id = ask ? button.dataset.askScript : button.dataset.copyScript;
  button.addEventListener("click", async () => {
    const panel = $("next-step");
    if (panel) panel.hidden = true;   // a panel left open from a starter would say "paste it into your AI chat" under a script
    try {
      const code = await loadScript(id);
      copyText(ask ? askFor(id, code) : code, ask ? "Copied. Paste it into your AI chat, and it will explain the script line by line." : "Copied. Now go to script.google.com, press New project, delete what's there, and paste.");
    } catch {
      say("Couldn't load that script. Try opening the page from its web link.");
    }
  });
});

document.querySelectorAll("[data-copy-from]").forEach((button) => {
  const source = $(button.dataset.copyFrom);
  button.setAttribute("aria-label", "Copy: " + source.textContent.trim());
  button.addEventListener("click", () => copyText(source.textContent.trim(), "Copied."));
});

document.querySelectorAll("[data-wish]").forEach((button) => {
  button.setAttribute("aria-describedby", "jar-hint");
  button.addEventListener("click", () => {
    const prompt = "Build me a small web app: " + button.dataset.wish + ". Make it simple, colorful, and fun to use. Use made-up data.";
    copyText(prompt, () => nextStep("Copied the wish: " + button.textContent + "."));
  });
});

// The wish builder: three short answers become a prompt
if ($("wb-out")) {
  const fields = ["wb-what", "wb-who", "wb-does"].map($);
  const wishText = () => {
    const [what, who, does] = fields.map((f) => f.value.trim());
    return "Build me a small web app: " + (what || "[what it is]") + " for " + (who || "[who it's for]") +
      ". It should " + (does || "[what it does]") + ". Make it simple, colorful, and fun to use. Use made-up data.";
  };
  const show = () => { $("wb-out").textContent = wishText(); };
  fields.forEach((f) => f.addEventListener("input", show));
  show();
  $("wb-copy").addEventListener("click", () => {
    if (fields.some((f) => !f.value.trim())) {
      say("Fill in all three answers first, or take one from the wish jar.");
      return;
    }
    copyText(wishText(), () => nextStep("Copied your wish."));
  });
}


// ---------- The machine room: play it, look inside, change it ----------

if ($("room")) {
  const room = $("room");
  const screen = $("screen");
  const codePane = $("code-pane");
  const codeBox = $("code");
  const toggleCode = $("toggle-code");
  let currentId = null;

  const showCode = (show) => {
    codePane.hidden = !show;
    $("room-body").classList.toggle("with-code", show);
    toggleCode.setAttribute("aria-expanded", String(show));
    toggleCode.textContent = show ? "Hide the code" : "Show the code";
  };

  const openRoom = async (id) => {
    try {
      const code = await loadCode(id);
      currentId = id;
      $("room-title").textContent = MACHINES[id].name;
      screen.title = MACHINES[id].name + " (running)";
      codeBox.value = code;
      screen.srcdoc = code;
      showCode(false);
      room.showModal();
    } catch {
      say("Couldn't load that starter. Try opening the page from its web link.");
    }
  };

  document.querySelectorAll("[data-play]").forEach((button) => {
    button.addEventListener("click", () => openRoom(button.dataset.play));
  });
  toggleCode.addEventListener("click", () => showCode(codePane.hidden));
  $("run").addEventListener("click", () => {
    screen.srcdoc = codeBox.value;
    say("Running your version.");
  });
  $("reset").addEventListener("click", () => {
    codeBox.value = codeCache[currentId];
    screen.srcdoc = codeBox.value;
    say("Back to the original.");
  });
  $("room-copy").addEventListener("click", () => {
    copyText(promptFor(currentId, codeBox.value), () => { room.close(); nextStep("Copied your version."); });
  });
  $("room-close").addEventListener("click", () => room.close());
  room.addEventListener("close", () => { screen.srcdoc = ""; });
}
