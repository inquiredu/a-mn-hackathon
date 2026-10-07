// The presenter view: one big idea per screen, read from the session file.
// Keys: → / Space / Page Down = next, ← / Page Up = back, F = full screen, N = jump to now,
// S = speaker notes in a second window.
// Add ?now=10:50 to the address to preview the clock-driven parts at any moment.

const screens = [];
SESSION.segments.forEach((segment) => {
  segment.screens.forEach((screen) => screens.push({ ...screen, segment }));
});

const stage = document.getElementById("stage");
let index = Math.min(Math.max(0, Number(location.hash.slice(1)) || 0), screens.length - 1);


// ---------- Time, in the session's time zone ----------

function toSeconds(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 3600 + m * 60;
}

function sessionNow() {
  const override = new URLSearchParams(location.search).get("now");
  if (override && /^\d{1,2}:\d{2}$/.test(override)) return toSeconds(override);
  const parts = {};
  new Intl.DateTimeFormat("en-US", {
    timeZone: SESSION.timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
  }).formatToParts(new Date()).forEach((p) => { parts[p.type] = p.value; });
  return Number(parts.hour) * 3600 + Number(parts.minute) * 60 + Number(parts.second);
}

function clockLabel(seconds) {
  const h = Math.floor(seconds / 3600) % 24;
  const m = Math.floor(seconds / 60) % 60;
  return (h % 12 || 12) + ":" + String(m).padStart(2, "0");
}


// ---------- Building blocks ----------

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function urlPill() {
  return el("p", "url", SESSION.url);
}

// One function per kind of screen. Each returns the elements to put on the stage.
const KINDS = {
  title(s) {
    const mark = el("img", "mark");
    mark.src = "assets/mngaia-mark.png";
    mark.alt = "MNGAIA, AI4MN";
    return [mark, el("p", "kicker", s.kicker), el("h1", "heading", s.heading), el("p", "body", s.sub)];
  },
  prompt(s) {
    const parts = [el("h1", "heading", s.heading)];
    if (s.big) parts.push(el("p", "big", s.big));
    if (s.body) parts.push(el("p", "body", s.body));
    if (s.url) parts.push(urlPill());
    if (s.foot) parts.push(el("p", "foot", s.foot));
    return parts;
  },
  steps(s) {
    const list = el("ol", "steps");
    s.steps.forEach((step) => list.append(el("li", "", step)));
    return [el("h1", "heading", s.heading), list, el("p", "foot", s.foot || "")];
  },
  link(s) {
    return [el("h1", "heading", s.heading), urlPill(), el("p", "body", s.body || "")];
  },
  embed(s) {
    const frame = el("iframe", "embed");
    frame.src = s.src;
    frame.title = s.heading;
    return [el("h1", "heading", s.heading), frame, el("p", "caption", s.caption || "")];
  },
  countdown(s) {
    const count = el("p", "count");
    count.dataset.until = s.until;
    return [el("h1", "heading", s.heading), count, el("p", "body", s.body || "")];
  },
  awards(s) {
    const list = el("ul", "awards");
    s.awards.forEach((a) => {
      const li = el("li");
      const icon = el("span", "award-icon", a.icon);
      icon.setAttribute("aria-hidden", "true");
      li.append(icon, el("strong", "", a.name), el("span", "", a.why));
      list.append(li);
    });
    return [el("h1", "heading", s.heading), list];
  },
  code(s) {
    return [el("h1", "heading", s.heading), el("pre", "code", s.code), el("p", "caption", s.caption || "")];
  },
  quote(s) {
    return [el("p", "quote", s.text)];
  },
  pair(s) {
    const pair = el("div", "pair");
    s.cards.forEach((c) => {
      const card = el("div");
      card.append(el("h3", "", c.heading), el("p", "", c.body));
      pair.append(card);
    });
    return [el("h1", "heading", s.heading), pair, el("p", "foot", s.foot || "")];
  }
};


// ---------- Speaker notes, in a second window that follows along ----------
// The stage and the notes window talk over a BroadcastChannel (same computer, same browser).

const channel = "BroadcastChannel" in window ? new BroadcastChannel("hands-on-stage") : null;
if (channel) {
  channel.onmessage = (event) => {
    const message = event.data || {};
    if (message.hello) channel.postMessage({ index });
    if (typeof message.go === "number") show(message.go);
  };
}

function openNotes() {
  window.open("notes.html", "hands-on-notes", "width=560,height=780");
}


// ---------- Showing a screen ----------

function show(i) {
  index = Math.min(Math.max(0, i), screens.length - 1);
  const screen = screens[index];
  stage.className = "stage kind-" + screen.kind;
  stage.replaceChildren(...KINDS[screen.kind](screen));
  history.replaceState(null, "", location.search + "#" + index);

  const seg = screen.segment;
  document.getElementById("rail-segment").textContent = seg.title + " · " + seg.start + " to " + seg.end + " · " + seg.where;
  document.getElementById("rail-count").textContent = (index + 1) + " / " + screens.length;
  document.getElementById("status").textContent =
    "Screen " + (index + 1) + " of " + screens.length + ": " + (screen.heading || screen.text || "");
  if (channel) channel.postMessage({ index });
  tick();
}

// Every second: the clock in the rail, and any countdown on the stage
function tick() {
  const now = sessionNow();
  document.getElementById("rail-clock").textContent = clockLabel(now);
  const count = stage.querySelector(".count");
  if (count) {
    const left = Math.ceil((toSeconds(count.dataset.until) - now) / 60);
    count.replaceChildren();
    if (left > 0) {
      count.append(String(left), el("small", "", left === 1 ? "minute" : "minutes"));
    } else {
      count.append("Time", el("small", "", "back to the main room"));
    }
  }
}
setInterval(tick, 1000);

// The first screen of whatever part of the session the clock says it is
function jumpToNow() {
  const now = sessionNow();
  const i = screens.findIndex((s) => now >= toSeconds(s.segment.start) && now < toSeconds(s.segment.end));
  if (i >= 0) show(i);
}


// ---------- Keys and buttons ----------

document.addEventListener("keydown", (event) => {
  if (event.target.closest && event.target.closest("iframe, input, textarea")) return;
  const key = event.key;
  if (event.target.tagName === "BUTTON" && (key === " " || key === "Enter")) return; // let the button do its job
  if (key === "ArrowRight" || key === "PageDown" || key === " ") { event.preventDefault(); show(index + 1); }
  else if (key === "ArrowLeft" || key === "PageUp") { event.preventDefault(); show(index - 1); }
  else if (key === "f" || key === "F") toggleFullScreen();
  else if (key === "n" || key === "N") jumpToNow();
  else if (key === "s" || key === "S") openNotes();
  else if (key === "Home") show(0);
  else if (key === "End") show(screens.length - 1);
});

function toggleFullScreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
}

document.getElementById("next").addEventListener("click", () => show(index + 1));
document.getElementById("prev").addEventListener("click", () => show(index - 1));
document.getElementById("full").addEventListener("click", toggleFullScreen);
document.getElementById("now-button").addEventListener("click", jumpToNow);
document.getElementById("notes-button").addEventListener("click", openNotes);

show(index);
