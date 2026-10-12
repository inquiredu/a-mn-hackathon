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

// Level 3: scripts for Apps Script, shown and copied from one file each
const SCRIPTS = {
  inventory: { name: "The Drive Inventory", file: "recipes/drive-inventory.gs" },
  multiplier: { name: "The Doc Multiplier", file: "recipes/doc-multiplier.gs" }
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


// Level 3: the scripts' steps, written once for Starters and Three levels (<div data-steps="inventory"></div>).
// Every step names its place; the permission screen is described as Google shows it.
// In the text, `backticks` mark exact words to find or type (shown as code), and *asterisks* the name of a button or menu.
const permission = (job) => ({
  text: "The first run asks permission:",
  sub: [
    "A box says the project needs your permission: press *Review permissions* and choose your school account.",
    "Google may say it hasn't verified this app, because you just wrote it: press *Advanced*, then the link that starts “Go to”. It may end in “(unsafe)”: that's Google's word for any script it hasn't reviewed, including your own.",
    "It asks to see, edit, create, and delete your Google Drive files and your Sheets. That's Google's standard wording for any script that touches Drive. " + job + " Press *Allow*."
  ],
  stop: "Stop here if you see “blocked by your administrator”: your district doesn't allow scripts. Ask your technology office."
});
const SCRIPT_STEPS = {
  inventory: {
    kind: "A script, not a page: it runs in Google Apps Script, inside your Google account, and does a job in your Drive. Nothing to play.",
    before: [
      "A practice folder in Drive with two or three made-up Docs and one folder inside it. Point it at a real folder once you've seen it work."
    ],
    steps: [
      "Press *Copy the script*.",
      "Go to `script.google.com` and press *New project*. A project is a file in your Drive that holds a script. Select everything in the editing area, delete it, and paste.",
      "Open your practice folder in Drive and look at the address bar: `drive.google.com/drive/folders/1AbC…xyz`. Copy the letters and numbers after `folders/`, and stop before any `?`.",
      "In the script, find the line `const FOLDER_ID = \"PASTE_THE_FOLDER_ID_HERE\"` and paste over the capital letters, keeping the quote marks.",
      "Press the *Save* icon. In the toolbar, the menu beside *Run* and *Debug* shows a name: choose `inventory`. Press *Run*.",
      permission("This script only reads files and makes one new Sheet; it never deletes."),
      "When it finishes, a panel called *Execution log* opens below the code. Its last line is “N files listed. Open the inventory:” with a link. Click it."
    ],
    end: "A new Sheet in My Drive named “Inventory:” plus your folder's name, one row per file: its folder, title, type, link, and when it last changed.",
    breaking: [
      "Red text in the *Execution log*: copy it and paste it into your AI chat with “What went wrong?”",
      "“Unexpected error” or “not found”: the folder ID is wrong or incomplete. Copy it again, stopping before any `?`.",
      "A folder with thousands of files can take minutes and may stop before the end. Try a small folder first."
    ]
  },
  multiplier: {
    kind: "A script, not a page: it runs in Google Apps Script, inside your Google account, and makes Docs in your Drive. Nothing to play.",
    before: [
      "A Doc to copy. Whatever is in it gets copied; a made-up team planning doc is fine.",
      "A Sheet whose first tab has one made-up name per row in column A, starting in row 2, with a heading like “Team” in row 1. Leave column B empty: the script writes each copy's link there, replacing anything in it."
    ],
    steps: [
      "Press *Copy the script*.",
      "Go to `script.google.com` and press *New project*. A project is a file in your Drive that holds a script. Select everything in the editing area, delete it, and paste.",
      "Open your Doc and look at the address bar: `docs.google.com/document/d/1AbC…xyz/edit`. Copy the letters and numbers between `/d/` and `/edit`. In the script, find `const TEMPLATE_ID = \"PASTE_THE_DOC_ID_HERE\"` and paste over the capital letters, keeping the quote marks.",
      "Do the same for your Sheet on the `SHEET_ID` line; its ID sits between `/d/` and `/edit` in the same way.",
      "Press the *Save* icon. In the toolbar, the menu beside *Run* and *Debug* shows a name: choose `multiply`. Press *Run*.",
      permission("This script reads your Doc and Sheet and makes copies in one new folder; it never deletes."),
      "When it finishes, a panel called *Execution log* opens below the code. Its last line is “N copies made. Open the folder:” with a link. Click it."
    ],
    end: "A new folder in My Drive named “Copies of” plus your Doc's name, one copy per row, each named for its row; and column B of your Sheet now holds a link to each copy. Run it again only if you want a second set.",
    breaking: [
      "Red text in the *Execution log*: copy it and paste it into your AI chat with “What went wrong?”",
      "“Unexpected error” or “not found”: an ID is wrong or incomplete. Copy it again, stopping before `/edit`.",
      "Blank Docs with the right names: the Doc you pointed at is empty, or you pasted the Sheet's ID on the Doc's line."
    ]
  }
};

// The steps' small markup, drawn as text nodes, code, and strong: never parsed as HTML
function richText(text) {
  const frag = document.createDocumentFragment();
  text.split(/(`[^`]+`|\*[^*]+\*)/).forEach((part) => {
    if (/^`.+`$/.test(part)) frag.append(el("code", "", part.slice(1, -1)));
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
    if (s.linkLabel) body.append(" ", linkTo(s.link, s.linkLabel));
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

// Where a part's button should go from this page: its own page, or, when that's the page you're on, down the page
function partLink(segment) {
  const [page, hash] = segment.link.split("#");
  const body = document.body.dataset;
  if (body.page === "hosts" && $("part-" + segment.id)) return { href: "#part-" + segment.id, label: "Go to this part" };
  if (page === here && !hash && body.jump) return { href: body.jump, label: body.jumpLabel || segment.linkLabel };
  if (page === here && hash) return { href: "#" + hash, label: segment.linkLabel };
  return { href: segment.link, label: segment.linkLabel };
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
    if (current.linkLabel) { go.href = current.link; go.textContent = current.linkLabel; }
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


// ---------- The level bar on Three levels: it sticks under the now bar and marks the level you're reading ----------

document.querySelectorAll(".level-bar").forEach((bar) => {
  const links = [...bar.querySelectorAll("a")];
  const nowbar = document.querySelector(".nowbar");
  const place = () => { bar.style.top = (nowbar && !nowbar.hidden && getComputedStyle(nowbar).position === "sticky" ? nowbar.offsetHeight : 0) + "px"; };
  place();
  addEventListener("resize", place);
  setInterval(place, 15000);
  if (!("IntersectionObserver" in window)) return;
  const watch = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => {
        const on = a.hash === "#" + entry.target.id;
        a.toggleAttribute("aria-current", on);
        if (on) bar.scrollTo({ left: a.offsetLeft - 16, behavior: "smooth" });   // on a phone, the level you're reading slides into view
      });
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  links.forEach((a) => { const target = document.querySelector(a.hash); if (target) watch.observe(target); });
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

document.querySelectorAll("[data-steps]").forEach((box) => {
  const plan = SCRIPT_STEPS[box.dataset.steps];
  if (!plan) return;
  const item = (step) => {
    const li = el("li");
    if (typeof step === "string") { li.append(richText(step)); return li; }
    li.append(richText(step.text));
    const sub = el("ol", "sub-steps");
    sub.type = "a";
    step.sub.forEach((text) => { const s2 = el("li"); s2.append(richText(text)); sub.append(s2); });
    li.append(sub);
    if (step.stop) { const stop = el("p", "stop-note"); stop.append(richText(step.stop)); li.append(stop); }
    return li;
  };
  const list = (items, tag) => { const l = el(tag); items.forEach((step) => l.append(item(step))); return l; };
  const end = el("p");
  end.append(richText(plan.end));
  box.replaceChildren(
    el("p", "kind", plan.kind),
    el("h5", "", "Before you start"), list(plan.before, "ul"),
    el("h5", "", "Steps"), list(plan.steps, "ol"),
    el("h5", "", "You'll know it worked"), end,
    el("h5", "", "If it breaks"), list(plan.breaking, "ul")
  );
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

function nextStep(what, trigger) {
  let panel = $("next-step");
  const fresh = !panel || panel.hidden;
  if (!panel) {
    panel = el("div", "next-step");
    panel.id = "next-step";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", "Next: paste it into your AI");
    document.body.append(panel);
  }
  nextStepReturn = trigger || nextStepReturn;
  const favorite = recall(TOOL_KEY);
  const tools = [...AI_TOOLS].sort((a, b) => (b.id === favorite) - (a.id === favorite));
  const inner = el("div", "next-step-inner");
  const lead = el("p", "next-step-lead", "Now paste it into your AI chat. Not open yet?");
  lead.tabIndex = -1;
  inner.append(el("p", "next-step-status", "Copied · " + what), lead);
  const row = el("div", "next-step-tools");
  tools.forEach((tool) => {
    const a = linkTo(tool.url, "Open " + tool.name + (tool.id === favorite ? " (your pick)" : ""));
    a.className = "button away" + (tool.id === favorite ? " primary" : "");
    a.target = "_blank";
    a.rel = "noopener";
    a.addEventListener("click", () => remember(TOOL_KEY, tool.id));
    const item = el("div", "next-step-tool");
    item.append(a, el("span", "", tool.tip));
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
  announce("Copied " + what + ". Now paste it into your AI chat.");
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
  button.addEventListener("click", () => copyText(text, null, button));
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
    closeNextStep();   // a sheet left open from a starter would say "paste it into your AI chat" under a script
    try {
      const code = await loadScript(id);
      copyText(ask ? askFor(id, code) : code, null, button);
    } catch {
      say("Couldn't load that script. Try opening the page from its web link.");
    }
  });
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
  const clearErrors = () => { fields.forEach((f) => f.removeAttribute("aria-invalid")); $("idea-error").textContent = ""; };
  fields.forEach((f) => f.addEventListener("input", () => { f.removeAttribute("aria-invalid"); if (!fields.some((x) => x.getAttribute("aria-invalid"))) $("idea-error").textContent = ""; render(); }));
  render();
  $("idea-copy").addEventListener("click", () => {
    const empty = fields.filter((f) => !f.value.trim());
    if (empty.length) {
      empty.forEach((f) => f.setAttribute("aria-invalid", "true"));
      $("idea-error").textContent = empty.length === 3 ? "Answer the three questions first, or take an idea from the jar." : "Answer " + (empty.length === 1 ? "the last question" : "the other questions") + " first.";
      empty[0].focus();
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
      markDone(button, "In the builder");
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

  const setStatus = (message, ms = 3000) => {
    clearTimeout(statusTimer);
    status.replaceChildren(message);
    if (ms) statusTimer = setTimeout(() => status.replaceChildren(), ms);
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
      status.replaceChildren();
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
    if (matchMedia("(max-width: 760px)").matches) showCode(false);   // on a phone, show what changed
    setStatus("Running your version.");
  });
  $("reset").addEventListener("click", () => {
    if (codeBox.value === codeCache[currentId]) { setStatus("This is the original."); return; }
    undoText = codeBox.value;
    codeBox.value = codeCache[currentId];
    run(codeBox.value);
    const undo = el("button", "sm", "Undo");
    undo.type = "button";
    undo.addEventListener("click", () => {
      codeBox.value = undoText;
      run(undoText);
      setStatus("Your changes are back.");
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
