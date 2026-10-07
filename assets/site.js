// Hands On: the script shared by Home, Starters, Grant a wish, and Hosts.
// Times, links, and the day all come from the session file (assets/session.js).
// Each part below checks that its pieces are on the page before it runs.

const $ = (id) => document.getElementById(id);
const LINKS = SESSION.links;
const EVENT_DAY = SESSION.day;

const MACHINES = {
  timer: { name: "The Meeting Timer", file: "cabinets/meeting-timer.html" },
  groups: { name: "The Group Maker", file: "cabinets/group-maker.html" },
  feedback: { name: "The Feedback Builder", file: "cabinets/feedback-builder.html" },
  calendar: { name: "The Calendar Explorer", file: "cabinets/calendar-explorer.html" },
  oracle: { name: "The Teacher's Lounge Oracle", file: "cabinets/oracle.html" }
};

// The AI tools people paste into, for the "next step" panel
const AI_TOOLS = [
  { id: "gemini", name: "Gemini", url: "https://gemini.google.com/app", tip: "Turn on Canvas in the prompt bar, then paste." },
  { id: "claude", name: "Claude", url: "https://claude.ai/new", tip: "Paste. The tool appears beside the chat." },
  { id: "chatgpt", name: "ChatGPT", url: "https://chatgpt.com/", tip: "Choose Canvas from the tools, paste, then press Preview." }
];


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
    li.append(el("time", "", s.start), body);
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
  const lead = el("strong", "", "It's " + segment.start + ": " + endWith(segment.title) + " ");
  cue.hidden = false;
  $("cue-text").replaceChildren(lead, segment.hint);
  $("cue-go").href = segment.link;
}
if ($("cue")) {
  $("cue-go").addEventListener("click", () => { $("cue").hidden = true; });
  $("cue-close").addEventListener("click", () => { $("cue").hidden = true; });
}

function showMode(mode) {
  document.body.dataset.mode = mode;
  document.querySelectorAll("[data-show]").forEach((section) => {
    section.hidden = !section.dataset.show.split(" ").includes(mode);
  });
}

function update() {
  const now = phase();
  showMode(now.mode);

  segments.forEach((s) => {
    if (!s.item) return;
    s.item.classList.remove("now", "done");
    s.item.removeAttribute("aria-current");
    s.state.textContent = "";
  });

  if (now.mode === "before") {
    setNow(now.today ? "Soon" : "", now.today ? "We start at " + segments[0].start + " Central. " : SESSION.dateLabel);
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
    setNow("Done", "That's a wrap. Thank you for building with us.");
    lastSegment = "after";
    return;
  }

  const current = segments[now.index];
  const next = segments[now.index + 1];
  segments.forEach((s, i) => {
    if (!s.item) return;
    if (i < now.index) { s.item.classList.add("done"); s.state.textContent = " (finished)"; }
  });
  if (current.item) {
    current.item.classList.add("now");
    current.item.setAttribute("aria-current", "step");
    current.state.textContent = " (happening now)";
  }

  const pieces = [linkTo(current.link, current.title)];
  if (next) pieces.push(el("span", "upnext", " · Next at " + next.start + ": " + next.title));
  setNow("Now", ...pieces);

  // The big card on Home
  if ($("nowcard-title")) {
    $("nowcard-title").textContent = current.title;
    $("nowcard-where").textContent = "· " + current.where;
    $("nowcard-hint").textContent = current.hint;
    const go = $("nowcard-go");
    go.hidden = !current.linkLabel;
    if (current.linkLabel) { go.href = current.link; go.textContent = current.linkLabel; }
    $("nowcard-next").textContent = next ? "Next at " + next.start + ": " + next.title : "Last part of the morning.";
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
    const a = linkTo(url, slot.dataset.label);
    a.className = "button primary";
    a.target = "_blank";
    a.rel = "noopener";
    slot.append(a);
  } else {
    slot.append(el("span", "pending", slot.dataset.pending || "The link appears here on Friday."));
  }
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
  inner.append(el("p", "next-step-lead", message + " Now paste it into your AI:"));
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
    "Please run it as a live preview I can play with (in Canvas, or as an artifact). " +
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
