// The stage timer: a countdown the presenter starts, pauses, and stretches or shrinks as the conversation goes.
// A screen in the session file asks for one with timer: a pace name ("share") or a number of minutes.
// Pure functions first (tested in scripts/test-stage-timer.js), then a small store for the stage.
// Lengths the presenter changes are remembered in this browser only.

const STAGE_TIMER = (() => {
  const MIN = 1;
  const MAX = 60;

  // The starting length in minutes: a number, or a pace from the session file (a range like [2, 3] uses the longer)
  // timer: a number of minutes, a pace name, or (with lengths) a part's id or "building"
  function startingMinutes(timer, pace, lengths) {
    const named = (pace && pace[timer] !== undefined) ? pace[timer] : lengths && lengths[timer];
    const value = typeof timer === "number" ? timer : named;
    const n = Array.isArray(value) ? Math.max(...value) : Number(value);
    return Number.isFinite(n) ? clampMinutes(n) : null;
  }

  function clampMinutes(n) {
    return Math.min(MAX, Math.max(MIN, Math.round(n)));
  }

  // run: { end } (epoch ms) while running, { left } (seconds) while paused, undefined when untouched
  function secondsLeft(run, minutes, now) {
    if (!run) return minutes * 60;
    if (run.end !== undefined) return Math.max(0, (run.end - now) / 1000);
    return run.left ?? minutes * 60;
  }

  function view(run, minutes, now) {
    const left = secondsLeft(run, minutes, now);
    const s = Math.ceil(left);
    const done = left <= 0;
    const running = run?.end !== undefined && !done;
    return {
      display: Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"),
      status: done ? "Time" : running ? "Running" : left < minutes * 60 ? "Paused" : "Ready",
      action: running ? "Pause" : done ? "Restart" : left < minutes * 60 ? "Resume" : "Start",
      running,
      done
    };
  }

  function toggle(run, minutes, now) {
    const v = view(run, minutes, now);
    if (v.running) return { left: secondsLeft(run, minutes, now) };
    const from = v.done ? minutes * 60 : secondsLeft(run, minutes, now);
    return { end: now + from * 1000 };
  }

  // Stretch or shrink by whole minutes without stopping: a running timer keeps running.
  // Returns the new length and run. Time left never drops below zero.
  function adjust(run, minutes, delta, now) {
    const next = clampMinutes(minutes + delta);
    const change = (next - minutes) * 60;
    if (!run) return { minutes: next, run: undefined };
    if (run.end !== undefined) {
      const left = Math.max(0, secondsLeft(run, minutes, now) + change);
      return { minutes: next, run: { end: now + left * 1000 } };
    }
    return { minutes: next, run: { left: Math.max(0, secondsLeft(run, minutes, now) + change) } };
  }

  // A small store for the stage: one timer per screen, keyed by the screen
  function createStore(storage) {
    const runs = {};
    let lengths = {};
    try { lengths = JSON.parse(storage?.getItem("hands-on-timers") || "{}"); } catch { lengths = {}; }
    const save = () => { try { storage?.setItem("hands-on-timers", JSON.stringify(lengths)); } catch { /* private window */ } };

    return {
      minutes: (key, starting) => (lengths[key] !== undefined ? clampMinutes(lengths[key]) : starting),
      view(key, starting, now) { return view(runs[key], this.minutes(key, starting), now); },
      toggle(key, starting, now) { runs[key] = toggle(runs[key], this.minutes(key, starting), now); },
      reset(key, starting) { runs[key] = undefined; },
      adjust(key, starting, delta, now) {
        const result = adjust(runs[key], this.minutes(key, starting), delta, now);
        runs[key] = result.run;
        lengths[key] = result.minutes;
        save();
      }
    };
  }

  // The whole session: how long is left, to the second. start is a second of the day, or null before the
  // call to order. Ready shows the full length; running counts down; past the end it counts how far over.
  function hms(seconds) {
    const s = Math.max(0, Math.round(seconds));
    return Math.floor(s / 3600) + ":" + String(Math.floor(s / 60) % 60).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }
  function sessionClock(now, start, length) {
    if (start === null || now < start) return { state: "ready", display: hms(length), label: "", pct: 0, over: false };
    const left = start + length - now;
    if (left >= 0) return { state: "running", display: hms(left), label: "left", pct: (100 * (length - left)) / length, over: false };
    return { state: "over", display: "+" + hms(-left), label: "over", pct: 100, over: true };
  }

  // When the two hours began: the presenter's call to order if there was one today, otherwise the
  // advertised start on the session's own day, otherwise not yet (so a rehearsal waits for the call).
  function resolveStart(saved, today, eventDay, scheduled) {
    if (saved !== null) return saved;
    return today === eventDay ? scheduled : null;
  }

  // A late start: the presenter can restart the two hours from now. Saved for that day only, in this browser.
  const START_KEY = "hands-on-started";
  function savedStart(storage, today) {
    try {
      const saved = JSON.parse(storage?.getItem(START_KEY) || "null");
      return saved && saved.day === today && Number.isFinite(saved.at) ? saved.at : null;
    } catch { return null; }
  }
  function saveStart(storage, today, at) {
    try { at === null ? storage?.removeItem(START_KEY) : storage?.setItem(START_KEY, JSON.stringify({ day: today, at })); } catch { /* private window */ }
  }

  return { startingMinutes, clampMinutes, secondsLeft, view, toggle, adjust, createStore, sessionClock, resolveStart, savedStart, saveStart, MIN, MAX };
})();

if (typeof module !== "undefined") module.exports = STAGE_TIMER;
