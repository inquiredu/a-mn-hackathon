// Builds one packet per reviewer from the capture manifest: the images it may open, in order, with captions.
// node packets.js <auditDir>          the first audit's fourteen packets
// node packets.js <auditDir> re       the re-review's seven packets, two surfaces each where they belong together
const fs = require("node:fs");
const path = require("node:path");
const DIR = path.resolve(process.argv[2]);
const SHOTS = path.join(DIR, "shots");
const man = JSON.parse(fs.readFileSync(path.join(SHOTS, "manifest.json"), "utf8"));
const abs = (f) => path.join(SHOTS, f);
const exists = (f) => fs.existsSync(abs(f));

function caption(m) {
  const bits = [m.surface, m.state, m.width ? m.width + "px" : "", m.theme, m.slice ? `slice ${m.slice}${m.pageHeight ? ` (scrolled to ${m.scrollY} of a ${m.pageHeight}px page)` : ""}` : "", m.kind === "motion" ? `motion: ${m.frames} frames sampled from ${m.captured} over ${m.windowMs} ms` : ""].filter(Boolean);
  return bits.join(" · ") + (m.note ? ` — ${m.note}` : "");
}
const pick = (fn) => man.filter(fn);
const byFile = (re) => pick((m) => re.test(m.file));

const sitePages = ["home", "levels", "starters", "invent", "hosts", "sources"];
const LENSES = {};

const surfaceTask = {
  home: "Home, in every state it has: after (the default today: a front door for anyone), before (the morning of the event: an invitation), and during (three moments of the live event). Also the notice that slides in when the event moves to its next part.",
  levels: "Three levels, with its folds closed and open, and the top of the page during the event.",
  starters: "Starters: the page, its Remix menus, the panel that appears after Copy for my AI, the confirmation message, and the copy-by-hand dialog. (The Play window itself has its own reviewer; judge only how the page leads into it.)",
  invent: "Invent your own: the page, the builder empty and filled, what happens when someone copies their request, and an idea from the jar filling the builder.",
  hosts: "Hosts: the guide for whoever runs the session, with folds closed and open, and during the event.",
  sources: "Sources: the page, a start-here path, a topic filter, and a search that finds nothing."
};
for (const p of sitePages) {
  LENSES[p] = {
    prefix: { home: "H", levels: "L", starters: "S", invent: "V", hosts: "O", sources: "R" }[p],
    title: { home: "Home", levels: "Three levels", starters: "Starters", invent: "Invent your own", hosts: "Hosts", sources: "Sources" }[p],
    task: surfaceTask[p] + " Light theme only: the dark theme has its own reviewer. Judge both widths: 375px (a phone) and 1280px (a laptop).",
    items: [
      ...pick((m) => m.surface === p && m.theme === "light" && m.file.startsWith(p + "/")),
      ...pick((m) => m.surface === p && m.theme === "light" && m.file.startsWith("states/"))
    ]
  };
}

LENSES.stage = {
  prefix: "P", title: "The stage",
  task: "The stage (present.html): all 21 screens at 1280×720, the size of a shared browser tab, and at 375px on a phone (a co-host following along); the session clock in each of its states; the screen timers; and frame strips of its transitions. Judge it as something shared in a Google Meet call and seen by participants in a video window, as well as by the presenter who drives it. The presenter controls (top right) are for the presenter.",
  items: [...byFile(/^stage\//), ...byFile(/^motion\/stage-next/)],
  extra: [path.join(DIR, "facts", "motion-notes.md")]
};
LENSES.notes = {
  prefix: "N", title: "Speaker notes",
  task: "The speaker notes (notes.html): a second window, opened at 560×780 beside the stage, that follows the stage and can move it, runs the screen timers, and keeps the session clock. Seen alone, and while following a running stage. Also at 375px and 1280px, since people open it on a phone or full-size too.",
  items: byFile(/^notes\//)
};
LENSES.play = {
  prefix: "Y", title: "The Play window and the six starters",
  task: "The Play window (a dialog on Starters that runs a starter in a frame, with Show the code, Copy for my AI, and Close) in light and dark at both widths, with the code shown and after Run my changes; and the six starters on their own, as they open and after their main action, at 960px (about the Play window's frame) and at 375px. Each starter is a single file people paste into an AI chat and remix, so it has to look good and work on its own, in an AI tool's preview panel, and on a Google Site. The starters have their own looks, deliberately different from the site; judge each on its own terms and as a set.",
  items: [...pick((m) => m.file.startsWith("states/play-")), ...byFile(/^cabinets\//)]
};

// Night: the dark theme across the site, in two halves so each reviewer can look closely
const nightTask = "The site's dark theme, Night. It is shown to visitors whose system is set to dark. The brand defines only a light theme; Night was drawn from the same color scales: navy pages, cream text, copper for warm notes. Judge whether it reads as designed rather than inverted: hierarchy, contrast, surfaces and their layering, borders, the warm accent, images and marks on dark, and consistency with the light theme's intent (you can't see the light theme, so judge Night on its own terms and for internal consistency). You see each page at 375px top to bottom, the top of each page at 1280px, and its interactive states in Night.";
function nightItems(pages, stateRe) {
  const out = [];
  for (const p of pages) {
    out.push(...pick((m) => m.surface === p && m.theme === "dark" && m.state === "after" && m.width === 375 && m.file.startsWith(p + "/")));
    out.push(...pick((m) => m.surface === p && m.theme === "dark" && m.state === "after" && m.width === 1280 && m.file.startsWith(p + "/") && m.slice <= 2));
    if (p === "home") out.push(...pick((m) => m.surface === "home" && m.theme === "dark" && (m.state === "before" || m.state === "during-remix") && m.width === 375 && m.slice <= 2));
  }
  out.push(...pick((m) => m.theme === "dark" && m.file.startsWith("states/") && stateRe.test(m.file) && !/folds-open/.test(m.file) && !/^states\/header-/.test(m.file)));
  out.push(...pick((m) => m.theme === "dark" && /folds-open/.test(m.file) && stateRe.test(m.file) && m.width === 375 && m.slice <= 3));
  return out;
}
LENSES["night-a"] = { prefix: "D", title: "Night (the dark theme): Home, Three levels, Starters", task: nightTask + " This half: Home, Three levels, and Starters (with its Remix menu, the next-step panel, the toast, the copy-by-hand dialog, and the Play window's frame around one starter).",
  items: nightItems(["home", "levels", "starters"], /(home-|levels-|starters-|fallback-|play-timer)/) };
LENSES["night-b"] = { prefix: "E", title: "Night (the dark theme): Invent your own, Hosts, Sources", task: nightTask + " This half: Invent your own, Hosts, and Sources, with their interactive states.",
  items: nightItems(["invent", "hosts", "sources"], /(invent-|hosts-|sources-)/) };

// The system: consistency across the site
const sys = [];
for (const p of sitePages) {
  const desk = pick((m) => m.surface === p && m.theme === "light" && m.state === "after" && m.width === 1280 && m.file.startsWith(p + "/"));
  sys.push(...desk.slice(0, 2), desk[desk.length - 1]);
}
sys.push(...byFile(/^states\/header-.*-1280-light/), ...byFile(/^states\/header-.*-375-light/));
LENSES.system = {
  prefix: "X", title: "The design system across the site",
  task: "Consistency across the six pages: the header, the footer, page titles and section titles, the type scale, buttons and links, cards and boxes, spacing rhythm, grids and alignment, color roles. You see the top two screens and the foot of each page at 1280px, each page's header at both widths, and a measured inventory (facts/inventory.md: every interactive element's look and states, every type style in use, reading measure, backgrounds, radii, shadows). Look for the same job done two ways, two jobs done one way, and values that drift. Propose a tighter system: the smallest set of components, type levels, and spacing steps that covers everything you see.",
  items: sys,
  extra: [path.join(DIR, "facts", "inventory.md")]
};

// Interaction and motion
LENSES.interaction = {
  prefix: "I", title: "Interaction and motion",
  task: "How the site behaves: hover, focus, pressed, selected, and disabled states; transitions and their timing; what appears when you act (panels, dialogs, messages) and how it arrives and leaves; target sizes on a phone; keyboard focus visibility. You have the measured inventory (facts/inventory.md: every interactive element's look in its default, hover, focus-visible, and pressed states, forced in DevTools; its transition; targets under 44px at 375px; animations), frame strips of the transitions people see (screenshots sampled every 30–80 ms after an action, with times), and screenshots of the states those actions lead to. Judge it against 'smooth interaction, clear intention' and the brand's motion rules (quiet, 120–360ms, ease-out, fades and short slides, no bounce; hover darkens fills one step or adds a ghost fill; links shift to copper with a copper underline; clickable cards lift 2px; press nudges 1px down; focus is a 2px copper ring).",
  items: [
    ...pick((m) => m.file.startsWith("motion/") && m.surface !== "stage"),
    ...pick((m) => m.file.startsWith("states/") && m.theme === "light" && /(remix-open|next-step|toast|fallback|play-timer-|invent-empty|invent-copied|invent-jar|sources-no-results|home-cue)/.test(m.file))
  ],
  extra: [path.join(DIR, "facts", "inventory.md"), path.join(DIR, "facts", "motion-notes.md")]
};

// Journeys: three people moving across pages
const J = [];
const first = (surface, state, width, theme, n) => pick((m) => m.surface === surface && m.state === state && m.width === width && m.theme === theme && m.file.startsWith(surface + "/") && (!n || m.slice <= n));
J.push({ heading: "Journey 1 · A teacher who got a link from a colleague, on a phone, any day. Goal: try a starter in their own AI chat." });
J.push(...first("home", "after", 375, "light"), ...first("starters", "after", 375, "light", 4), ...byFile(/^states\/starters-next-step-375-light/), ...byFile(/^states\/play-timer-375-light/), ...first("invent", "after", 375, "light", 3));
J.push({ heading: "Journey 2 · An instructional coach who wants to run the session with their staff, on a laptop. Goal: understand what running it takes, then open the stage and the notes." });
J.push(...first("home", "after", 1280, "light"), ...first("hosts", "after", 1280, "light", 5), ...byFile(/^stage\/clock-ready-1280/), ...byFile(/^stage\/screen-0[1-4]-1280/), ...byFile(/^notes\/alone-screen01-560/));
J.push({ heading: "Journey 3 · A participant during the live event, on a phone beside Google Meet. Goal: know what's happening now and get to it." });
J.push(...first("home", "during-remix", 375, "light"), ...byFile(/^states\/home-cue-375-light/), ...first("starters", "during", 375, "light"), ...first("home", "during-cheer", 375, "light", 2), ...first("home", "during-close", 375, "light", 2));
LENSES.journeys = {
  prefix: "J", title: "Journeys across the site",
  task: "Three people moving across pages to get something done. Judge the experience between screens: does each step make the next one obvious, is the way back clear, do pages hand off to each other consistently, where would each person hesitate, backtrack, or give up, and what does each moment ask them to read before they can act? Single-page polish is covered elsewhere; focus on flow, wayfinding, and the number of decisions and words between intent and done.",
  items: J
};

// ---------- The re-review: seven fresh reviewers, two surfaces each where they belong together ----------
const REVIEW = {};
const join = (...lenses) => ({
  prefix: lenses.map((l) => l.prefix).join(" and "),
  title: lenses.map((l) => l.title).join(" · "),
  task: lenses.map((l) => `**${l.title}** (finding IDs ${l.prefix}1, ${l.prefix}2, ...). ${l.task}`).join("\n\n"),
  items: lenses.flatMap((l) => [{ heading: l.title }, ...l.items]),
  extra: [...new Set(lenses.flatMap((l) => l.extra || []))]
});
const noMotionNotes = (l) => ({ ...l, extra: (l.extra || []).filter((f) => !/motion-notes/.test(f)) });   // the first audit's timings, before the fixes
REVIEW["home-levels"] = join(LENSES.home, LENSES.levels);
REVIEW["starters-invent"] = join(LENSES.starters, LENSES.invent);
REVIEW["hosts-sources"] = join(LENSES.hosts, LENSES.sources);
REVIEW["stage-notes"] = join(noMotionNotes(LENSES.stage), LENSES.notes);
REVIEW.play = LENSES.play;
REVIEW["night-system"] = join({ ...LENSES["night-a"], prefix: "D", title: "Night: Home, Three levels, Starters" }, { ...LENSES["night-b"], prefix: "E", title: "Night: Invent your own, Hosts, Sources" }, LENSES.system);
REVIEW["interaction-journeys"] = join(noMotionNotes(LENSES.interaction), LENSES.journeys);

const RE = process.argv[3] === "re";
const SET = RE ? REVIEW : LENSES;
fs.mkdirSync(path.join(DIR, RE ? "packets-re" : "packets"), { recursive: true });
const summary = {};
for (const [name, L] of Object.entries(SET)) {
  const lines = [`# Packet: ${L.title}`, "", L.task, "", "Open only these files.", ""];
  if (L.extra && L.extra.length) { lines.push("## Facts", ""); L.extra.forEach((f) => lines.push(`- ${f}`)); lines.push(""); }
  lines.push("## Images, in order", "");
  let n = 0;
  L.items.forEach((m) => {
    if (m.heading) { lines.push("", `### ${m.heading}`, ""); return; }
    if (!exists(m.file)) return;
    n++;
    lines.push(`${n}. ${abs(m.file)}  \n   ${caption(m)}`);
  });
  fs.writeFileSync(path.join(DIR, RE ? "packets-re" : "packets", name + ".md"), lines.join("\n") + "\n");
  summary[name] = n;
}
console.log(summary);
