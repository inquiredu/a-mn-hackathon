// The presenter view: one big idea per screen, read from the session file.
// Keys: → / Space / Page Down = next, ← / Page Up = back, F = full screen, N = jump to now,
// S = speaker notes in a second window, C = the session clock large (Esc puts it back). On a screen with a timer:
// T = start or pause, + and - = a minute more or less; on the opening screen, T calls the session to order.
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

// Today's date in the session's time zone, so a late start saved today doesn't carry to another day
function sessionDay() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: SESSION.timeZone }).format(new Date());
}

// The two hours: from the presenter's call to order, or the advertised start on the day, or not yet
function browserStore() {
  try { return localStorage; } catch { return undefined; }
}
function sessionClock(now) {
  const start = STAGE_TIMER.resolveStart(STAGE_TIMER.savedStart(browserStore(), sessionDay()), sessionDay(), SESSION.day, toSeconds(SESSION.start));
  return STAGE_TIMER.sessionClock(now, start, toSeconds(SESSION.end) - toSeconds(SESSION.start));
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
  plan(s) {
    // The morning, from the session file: every part's time, name, and place
    const list = el("ol", "plan");
    SESSION.segments.forEach((seg) => {
      const li = el("li");
      li.append(el("span", "length", seg.minutes + " min"), el("strong", "", seg.title), el("span", "", seg.where));
      list.append(li);
    });
    const parts = [el("h1", "heading", s.heading), list];
    if (s.url) parts.push(urlPill());
    return parts;
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


// ---------- The timer, on screens that ask for one ----------

const timers = STAGE_TIMER.createStore((() => { try { return localStorage; } catch { return undefined; } })());
const timerKey = (screen) => screen.segment.id + "/" + (screen.heading || "");
const timerStart = (screen) => STAGE_TIMER.startingMinutes(screen.timer, SESSION.pace);
let timerWasDone = false;

function timerBlock() {
  const box = el("div", "timer");
  box.setAttribute("role", "group");
  box.setAttribute("aria-label", "Timer");
  const buttons = el("div", "timer-buttons");
  [["go", "Start", ""], ["minus", "−1 min", "One minute less"], ["plus", "+1 min", "One minute more"], ["reset", "Reset", ""]].forEach(([action, label, aria]) => {
    const b = el("button", "timer-" + action, label);
    b.type = "button";
    if (aria) b.setAttribute("aria-label", aria);
    b.addEventListener("click", () => timerAction(action === "go" ? "toggle" : action));
    buttons.append(b);
  });
  box.append(el("p", "timer-display"), el("p", "timer-status"), buttons);
  return box;
}

function timerAction(action) {
  const screen = screens[index];
  if (!screen.timer) return;
  const key = timerKey(screen);
  const start = timerStart(screen);
  const now = Date.now();
  if (action === "toggle") timers.toggle(key, start, now);
  else if (action === "plus") timers.adjust(key, start, +1, now);
  else if (action === "minus") timers.adjust(key, start, -1, now);
  else if (action === "reset") timers.reset(key, start);
  tick();
}

// The timer's state for the stage and the notes window, or null on a screen without one
function timerState() {
  const screen = screens[index];
  if (!screen.timer || timerStart(screen) === null) return null;
  const v = timers.view(timerKey(screen), timerStart(screen), Date.now());
  return { display: v.display, status: v.status, action: v.action, done: v.done, minutes: timers.minutes(timerKey(screen), timerStart(screen)) };
}


// ---------- The session clock: big on the opening screen, then in the corner, and large again on a click ----------
// One element moves between three places; CSS animates the move.

const clockBox = document.getElementById("session-clock");
let clockOpen = false;
let wait = null;   // { minutes, run } while a wait-time countdown is on

function placeClock() {
  clockBox.dataset.mode = clockOpen ? "open" : index === 0 ? "hero" : "corner";
  document.getElementById("sc-backdrop").hidden = !clockOpen;
  document.getElementById("sc-face").setAttribute("aria-expanded", String(clockOpen));
}

function openClock(open) {
  clockOpen = open;
  placeClock();
  if (open) document.getElementById("sc-close").focus();
}

function callToOrder() {
  STAGE_TIMER.saveStart(browserStore(), sessionDay(), sessionNow());
  document.getElementById("status").textContent = "The two hours have started.";
  tick();
}

function startWait(minutes) {
  wait = { minutes, run: STAGE_TIMER.toggle(undefined, minutes, Date.now()) };
  tick();
}

function showClock(now) {
  const two = sessionClock(now);
  document.getElementById("sc-time").textContent = two.display;
  document.getElementById("sc-label").textContent = two.state === "ready" ? TIMES.fill("{length}") : two.label;
  clockBox.dataset.state = two.state;
  document.getElementById("sc-start").hidden = two.state !== "ready";
  document.querySelector(".rail").style.setProperty("--elapsed", two.pct.toFixed(2) + "%");
  const waitBox = document.getElementById("sc-wait");
  if (wait) {
    const v = STAGE_TIMER.view(wait.run, wait.minutes, Date.now());
    waitBox.hidden = false;
    document.getElementById("sc-wait-time").textContent = v.done ? "Time" : v.display;
    waitBox.classList.toggle("done", v.done);
  } else {
    waitBox.hidden = true;
  }
  clockBox.classList.toggle("waiting", !!wait);
}

document.getElementById("sc-face").addEventListener("click", () => openClock(!clockOpen));
document.getElementById("sc-close").addEventListener("click", () => openClock(false));
document.getElementById("sc-backdrop").addEventListener("click", () => openClock(false));
document.getElementById("sc-start").addEventListener("click", callToOrder);
document.getElementById("sc-wait-clear").addEventListener("click", () => { wait = null; tick(); });
document.querySelectorAll("[data-wait]").forEach((b) => b.addEventListener("click", () => startWait(Number(b.dataset.wait))));


// ---------- Speaker notes, in a second window that follows along ----------
// The stage and the notes window talk over a BroadcastChannel (same computer, same browser).

const channel = "BroadcastChannel" in window ? new BroadcastChannel("hands-on-stage") : null;
if (channel) {
  channel.onmessage = (event) => {
    const message = event.data || {};
    if (message.hello) channel.postMessage({ index, timer: timerState() });
    if (typeof message.go === "number") show(message.go);
    if (message.timer) timerAction(message.timer);
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
  if (timerState()) { stage.append(timerBlock()); stage.classList.add("has-timer"); }
  timerWasDone = false;
  history.replaceState(null, "", location.search + "#" + index);
  placeClock();

  const seg = screen.segment;
  document.getElementById("rail-segment").textContent = seg.title + " · " + seg.minutes + " min · " + seg.where;
  document.getElementById("rail-count").textContent = (index + 1) + " / " + screens.length;
  document.getElementById("status").textContent =
    "Screen " + (index + 1) + " of " + screens.length + ": " + (screen.heading || screen.text || "");
  tick();
}

// Every second: the clock in the rail, and any countdown on the stage
function tick() {
  const now = sessionNow();
  showClock(now);
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
  const state = timerState();
  const box = stage.querySelector(".timer");
  if (state && box) {
    box.classList.toggle("done", state.done);
    box.querySelector(".timer-display").textContent = state.display;
    box.querySelector(".timer-status").textContent = state.status + " · " + state.minutes + " min";
    box.querySelector(".timer-go").textContent = state.action;
    if (state.done && !timerWasDone) document.getElementById("status").textContent = "Time.";
    timerWasDone = state.done;
  }
  if (channel) channel.postMessage({ index, timer: state });
}
setInterval(tick, 500);

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
  if (key === "Escape" && clockOpen) { openClock(false); return; }
  if (key === "ArrowRight" || key === "PageDown" || key === " ") { event.preventDefault(); show(index + 1); }
  else if (key === "ArrowLeft" || key === "PageUp") { event.preventDefault(); show(index - 1); }
  else if (key === "f" || key === "F") toggleFullScreen();
  else if (key === "n" || key === "N") jumpToNow();
  else if (key === "s" || key === "S") openNotes();
  else if (key === "c" || key === "C") openClock(!clockOpen);
  else if (key === "t" || key === "T") {
    if (screens[index].timer) timerAction("toggle");
    else if (sessionClock(sessionNow()).state === "ready") callToOrder();
  }
  else if (key === "+" || key === "=") timerAction("plus");
  else if (key === "-" || key === "_") timerAction("minus");
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
