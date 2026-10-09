// The stage timer: a countdown the presenter starts, pauses, and stretches or shrinks as the conversation goes.
// A screen in the session file asks for one with timer: a pace name ("share") or a number of minutes.
// Pure functions first (tested in scripts/test-stage-timer.js), then a small store for the stage.
// Lengths the presenter changes are remembered in this browser only.

const STAGE_TIMER = (() => {
  const MIN = 1;
  const MAX = 60;

  // The starting length in minutes: a number, or a pace from the session file (a range like [2, 3] uses the longer)
  function startingMinutes(timer, pace) {
    const value = typeof timer === "number" ? timer : pace && pace[timer];
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

  // The whole session, for the corner of the stage: how far in, out of how long, and whether it's over.
  // All in seconds of the day. Before the start it reads 0:00.
  function hm(seconds) {
    const m = Math.floor(seconds / 60);
    return Math.floor(m / 60) + ":" + String(m % 60).padStart(2, "0");
  }
  function sessionElapsed(now, start, length) {
    const elapsed = Math.max(0, now - start);
    const over = elapsed > length;
    return {
      elapsed,
      display: over ? "+" + hm(elapsed - length) + " over" : hm(elapsed) + " of " + hm(length),
      pct: Math.min(100, (100 * elapsed) / length),
      started: now >= start,
      over
    };
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

  return { startingMinutes, clampMinutes, secondsLeft, view, toggle, adjust, createStore, sessionElapsed, savedStart, saveStart, MIN, MAX };
})();

if (typeof module !== "undefined") module.exports = STAGE_TIMER;
