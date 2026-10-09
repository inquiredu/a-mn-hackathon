// Tests for the stage timer's arithmetic: node scripts/test-stage-timer.js
const assert = require("assert");
const T = require("../assets/stage-timer.js");

const pace = { share: [2, 3], wonder: 2, showTurn: 4 };
const t0 = 1_000_000;

// Starting length
assert.strictEqual(T.startingMinutes("share", pace), 3, "a range uses the longer end");
assert.strictEqual(T.startingMinutes("showTurn", pace), 4);
assert.strictEqual(T.startingMinutes(5, pace), 5);
assert.strictEqual(T.startingMinutes("nope", pace), null, "an unknown pace gives no timer");
assert.strictEqual(T.startingMinutes(90, pace), 60, "at most an hour");

// Untouched, running, paused, done
assert.deepStrictEqual(
  [T.view(undefined, 4, t0).display, T.view(undefined, 4, t0).status, T.view(undefined, 4, t0).action],
  ["4:00", "Ready", "Start"]);
let run = T.toggle(undefined, 4, t0);
assert.strictEqual(T.view(run, 4, t0 + 30_500).display, "3:30");
assert.strictEqual(T.view(run, 4, t0 + 30_500).status, "Running");
run = T.toggle(run, 4, t0 + 60_000);
assert.deepStrictEqual([T.view(run, 4, t0 + 999_999).display, T.view(run, 4, t0).action], ["3:00", "Resume"], "paused holds");
run = T.toggle(run, 4, t0 + 100_000);
assert.strictEqual(T.view(run, 4, t0 + 100_000 + 180_000).status, "Time");
assert.strictEqual(T.view(run, 4, t0 + 999_999).display, "0:00", "never negative");
assert.strictEqual(T.view(run, 4, t0 + 999_999).action, "Restart");
assert.strictEqual(T.view(T.toggle(run, 4, t0 + 999_999), 4, t0 + 999_999).display, "4:00", "restart starts over");

// Stretching while it runs keeps it running and adds the minute to what's left
run = T.toggle(undefined, 4, t0);
let r = T.adjust(run, 4, +1, t0 + 60_000);
assert.strictEqual(r.minutes, 5);
assert.strictEqual(T.view(r.run, r.minutes, t0 + 60_000).display, "4:00");
assert.strictEqual(T.view(r.run, r.minutes, t0 + 60_000).running, true);
// Shrinking below what's left stops at zero, not negative
r = T.adjust(run, 4, -1, t0 + 200_000);
assert.strictEqual(T.view(r.run, r.minutes, t0 + 200_000).display, "0:00");
// Adjusting an untouched timer just changes its length; never below one minute
r = T.adjust(undefined, 1, -1, t0);
assert.strictEqual(r.minutes, 1);
assert.strictEqual(T.view(r.run, r.minutes, t0).display, "1:00");

// The store remembers lengths, not runs
const memory = {};
const storage = { getItem: (k) => memory[k] ?? null, setItem: (k, v) => { memory[k] = v; } };
const a = T.createStore(storage);
a.adjust("show", 4, +2, t0);
assert.strictEqual(T.createStore(storage).minutes("show", 4), 6, "a new store reads the saved length");
assert.strictEqual(T.createStore(storage).view("show", 4, t0).status, "Ready", "runs aren't saved");
assert.strictEqual(T.createStore({ getItem() { throw new Error("blocked"); } }).minutes("show", 4), 4, "blocked storage falls back");

// The two hours, in the corner
const ten = 10 * 3600, two = 2 * 3600;
assert.strictEqual(T.sessionElapsed(ten - 300, ten, two).display, "0:00 of 2:00", "before the start");
assert.strictEqual(T.sessionElapsed(ten - 300, ten, two).started, false);
assert.strictEqual(T.sessionElapsed(ten + 42 * 60 + 59, ten, two).display, "0:42 of 2:00", "whole minutes, rounded down");
assert.strictEqual(T.sessionElapsed(ten + 90 * 60, ten, two).pct, 75);
assert.strictEqual(T.sessionElapsed(ten + two, ten, two).display, "2:00 of 2:00");
assert.strictEqual(T.sessionElapsed(ten + two + 5 * 60, ten, two).display, "+0:05 over");
assert.strictEqual(T.sessionElapsed(ten + two + 5 * 60, ten, two).pct, 100);

console.log("stage timer: all tests pass");
