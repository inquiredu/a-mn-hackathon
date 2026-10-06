// Hands On: A Friday Hackathon

// ---------- Settings to fill in before Friday ----------

// Links to the shared Google Slides. Until they're filled in, the page says so.
const LINKS = {
  gallery: "",  // the gallery wall
  wonder: ""    // the wonder and worry wall
};

const EVENT_DAY = "2026-10-09";   // the "Now" bar only runs on this day (Central time)

const MACHINES = {
  oracle: { name: "The Teacher's Lounge Oracle", file: "cabinets/oracle.html" }
};


// ---------- The "Now" bar ----------
// Reads the times from the Today list. Add ?now=10:50 to the address to preview any moment.

const nowLine = document.getElementById("now");
const agenda = [...document.querySelectorAll("#timeline li")].map((item) => ({
  item,
  start: toMinutes(item.dataset.start),
  end: toMinutes(item.dataset.end),
  title: item.querySelector("strong").textContent,
  link: item.dataset.link
}));

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function centralNow() {
  const override = new URLSearchParams(location.search).get("now");
  if (override && /^\d{1,2}:\d{2}$/.test(override)) {
    return { day: EVENT_DAY, minutes: toMinutes(override) };
  }
  const parts = {};
  new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(new Date()).forEach((p) => { parts[p.type] = p.value; });
  return { day: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

function setNow(tag, ...pieces) {
  nowLine.replaceChildren();
  if (tag) {
    const pill = document.createElement("span");
    pill.className = "tag";
    pill.textContent = tag;
    nowLine.append(pill);
  }
  pieces.forEach((piece) => nowLine.append(piece));
}

function linkTo(href, text) {
  const a = document.createElement("a");
  a.href = href;
  a.textContent = text;
  return a;
}

function span(className, text) {
  const s = document.createElement("span");
  s.className = className;
  s.textContent = text;
  return s;
}

function updateNow() {
  const { day, minutes } = centralNow();
  agenda.forEach(({ item }) => {
    item.classList.remove("now", "done");
    item.removeAttribute("aria-current");
  });

  if (day !== EVENT_DAY) {
    setNow("", "Friday, October 9 · 10:00 to noon Central");
    return;
  }
  const first = agenda[0];
  const last = agenda[agenda.length - 1];
  if (minutes < first.start) {
    setNow("Soon", "We start at 10:00 Central. ", linkTo("#today", "See the plan"));
    return;
  }
  if (minutes >= last.end) {
    agenda.forEach(({ item }) => item.classList.add("done"));
    setNow("Done", "That's a wrap. Thank you for building with us.");
    return;
  }

  const index = agenda.findIndex((a) => minutes >= a.start && minutes < a.end);
  agenda.forEach((a, i) => { if (i < index) a.item.classList.add("done"); });
  const current = agenda[index];
  current.item.classList.add("now");
  current.item.setAttribute("aria-current", "step");

  const next = agenda[index + 1];
  const pieces = [linkTo(current.link, current.title)];
  if (next) pieces.push(span("upnext", ` · Next at ${next.item.dataset.start}: ${next.title}`));
  setNow("Now", ...pieces);
}

updateNow();
setInterval(updateNow, 30000);


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
    slot.append(span("pending", "The link appears here on Friday."));
  }
});


// ---------- Toast messages ----------

const toast = document.getElementById("toast");
let toastTimer;
function say(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}


// ---------- Copying: the modern way, then the older way, then by hand ----------

const fallback = document.getElementById("fallback");
const fallbackText = document.getElementById("fallback-text");

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
  fallbackText.value = text;
  fallback.showModal();
  fallbackText.focus();
  fallbackText.select();
}

function copyText(text, message) {
  const tryOlder = () => (olderCopy(text) ? say(message) : copyByHand(text));
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => say(message), tryOlder);
  } else {
    tryOlder();
  }
}
document.getElementById("fallback-close").addEventListener("click", () => fallback.close());


// ---------- Machines ----------

// Load every machine up front, so a Copy click never has to wait
// (some browsers, Safari especially, refuse to copy after a wait).
const codeCache = {};
async function loadCode(id) {
  if (!codeCache[id]) {
    const response = await fetch(MACHINES[id].file);
    if (!response.ok) throw new Error("Could not load " + MACHINES[id].file);
    codeCache[id] = await response.text();
  }
  return codeCache[id];
}
Object.keys(MACHINES).forEach((id) => loadCode(id).catch(() => {}));

function promptFor(id, code) {
  return `Here is the code for a small web app called "${MACHINES[id].name}". ` +
    "Please run it as a live preview I can play with (in Canvas, or as an artifact). " +
    "Don't change anything yet. I'll ask for changes next.\n\n" +
    "```html\n" + code + "\n```";
}

async function copyMachine(id) {
  const message = "Copied. Now paste it into Gemini, Claude, or ChatGPT.";
  if (codeCache[id]) return copyText(promptFor(id, codeCache[id]), message);
  try {
    copyText(promptFor(id, await loadCode(id)), message);
  } catch {
    say("Couldn't load that machine. Try opening the page from its web link.");
  }
}

document.querySelectorAll("[data-copy-machine]").forEach((button) => {
  button.addEventListener("click", () => copyMachine(button.dataset.copyMachine));
});


// ---------- Remix menus, prompts, and the wish jar ----------

document.querySelectorAll(".remix li:not(.do)").forEach((item) => {
  const text = item.querySelector("span").firstChild.textContent.trim();
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Copy";
  button.setAttribute("aria-label", "Copy: " + text);
  button.addEventListener("click", () => copyText(text, "Copied. Paste it into the same AI chat."));
  item.appendChild(button);
});

document.querySelectorAll("[data-copy-from]").forEach((button) => {
  const source = document.getElementById(button.dataset.copyFrom);
  button.setAttribute("aria-label", "Copy: " + source.textContent.trim());
  button.addEventListener("click", () => copyText(source.textContent.trim(), "Copied. Paste it into your AI."));
});

document.querySelectorAll("[data-wish]").forEach((button) => {
  button.addEventListener("click", () => {
    const prompt = `Build me a small web app: ${button.dataset.wish}. Make it simple, colorful, and fun to use. Use made-up data.`;
    copyText(prompt, "Wish copied. Paste it into your AI.");
  });
});


// ---------- The machine room: play it, look inside, change it ----------

const room = document.getElementById("room");
const roomTitle = document.getElementById("room-title");
const roomBody = document.getElementById("room-body");
const screen = document.getElementById("screen");
const codePane = document.getElementById("code-pane");
const codeBox = document.getElementById("code");
const toggleCode = document.getElementById("toggle-code");
let currentId = null;

function showCode(show) {
  codePane.hidden = !show;
  roomBody.classList.toggle("with-code", show);
  toggleCode.setAttribute("aria-expanded", String(show));
  toggleCode.textContent = show ? "Hide the code" : "Show the code";
}

async function openRoom(id) {
  try {
    const code = await loadCode(id);
    currentId = id;
    roomTitle.textContent = MACHINES[id].name;
    codeBox.value = code;
    screen.srcdoc = code;
    showCode(false);
    room.showModal();
  } catch {
    say("Couldn't load that machine. Try opening the page from its web link.");
  }
}

document.querySelectorAll("[data-play]").forEach((button) => {
  button.addEventListener("click", () => openRoom(button.dataset.play));
});
toggleCode.addEventListener("click", () => showCode(codePane.hidden));
document.getElementById("run").addEventListener("click", () => {
  screen.srcdoc = codeBox.value;
  say("Running your version.");
});
document.getElementById("reset").addEventListener("click", () => {
  codeBox.value = codeCache[currentId];
  screen.srcdoc = codeBox.value;
  say("Back to the original.");
});
document.getElementById("room-copy").addEventListener("click", () => {
  copyText(promptFor(currentId, codeBox.value), "Copied your version. Paste it into your AI.");
});
document.getElementById("room-close").addEventListener("click", () => room.close());
room.addEventListener("close", () => { screen.srcdoc = ""; });
