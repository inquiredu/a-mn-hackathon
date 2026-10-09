// The clock for the whole site. Every time, date, and length comes from the session file:
// this lays the parts end to end from the session's start, then fills in the {braces}
// in the session file's text and in any page element marked data-fill.
// Load it right after assets/session.js, on every page.
//
// What you can write in braces:
//   {start} {end}              the session's start and end: "10:00", "noon"
//   {wish.start} {wish.end}    when a part starts or ends, by its id
//   {wish.end - nudge}         a time moved by some minutes, or by a pace: "11:15"
//   {length} {wish.length}     how long the session or a part runs: "two hours", "40 minutes"
//   {building}                 all the time in breakout rooms: "57 minutes"
//   {nudge}                    a pace from the session file: "ten minutes" ([2, 3] reads "two or three minutes")
//   {weekday} {date} {zone}    "Friday", "October 9", "Central"
//   {parts}                    how many parts: "7"
//   {title} {subtitle} {org}   the session's names
//   {links.teams}              a link from the session file, for chat messages
// Add :number or :unit to split a length for big numerals ("2" and "hours"),
// and start with a capital letter to capitalize: {Length} reads "Two hours".

const TIMES = (() => {
  const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  const TOKEN = /\{([A-Za-z][\w.]*(?:\s*[+-]\s*\w+)?(?::\w+)?)\}/g;
  const pace = SESSION.pace || {};

  const toMinutes = (time) => { const [h, m] = time.split(":").map(Number); return h * 60 + m; };
  const toTime = (minutes) => String(Math.floor(minutes / 60)).padStart(2, "0") + ":" + String(minutes % 60).padStart(2, "0");
  const count = (n) => (n <= 10 ? WORDS[n] : String(n));

  // "13:05" reads "1:05", and twelve o'clock reads "noon"
  function clock(time) {
    const minutes = toMinutes(time);
    if (minutes === 12 * 60) return "noon";
    return (Math.floor(minutes / 60) % 12 || 12) + ":" + String(minutes % 60).padStart(2, "0");
  }

  // Whole hours from two up read in hours; everything else in minutes
  function split(minutes) {
    if (minutes >= 120 && minutes % 60 === 0) return [minutes / 60, "hours"];
    return [minutes, minutes === 1 ? "minute" : "minutes"];
  }

  function length(minutes) {
    if (Array.isArray(minutes)) return minutes.map(count).join(" or ") + " minutes";
    const [n, unit] = split(minutes);
    return count(n) + " " + unit;
  }


  // ---------- The parts, end to end ----------

  const parts = {};
  let at = toMinutes(SESSION.start);
  SESSION.segments.forEach((segment) => {
    segment.start = toTime(at);
    at += segment.minutes;
    segment.end = toTime(at);
    if (parts[segment.id]) console.error("Two parts share the id \"" + segment.id + "\" in the session file.");
    parts[segment.id] = segment;
  });
  if (at > toMinutes(SESSION.end)) {
    console.warn("The parts run to " + clock(toTime(at)) + ", past the session's end at " + clock(SESSION.end) + ".");
  }


  // ---------- Reading {braces} ----------

  const day = new Date(SESSION.day + "T12:00:00Z");
  const zone = new Intl.DateTimeFormat("en-US", { timeZone: SESSION.timeZone, timeZoneName: "longGeneric" })
    .formatToParts(day).find((p) => p.type === "timeZoneName");
  const named = {
    weekday: day.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }),
    date: day.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" }),
    zone: zone ? zone.value.replace(/ Time$/, "") : SESSION.timeZone,
    parts: String(SESSION.segments.length)
  };

  // One value: a { time } or a { length } in minutes, or some { text }
  function lookup(name) {
    if (name === "start" || name === "end") return { time: toMinutes(SESSION[name]) };
    if (name === "length") return { length: toMinutes(SESSION.end) - toMinutes(SESSION.start) };
    if (name === "building") {
      return { length: SESSION.segments.filter((s) => s.where === "Breakout rooms").reduce((sum, s) => sum + s.minutes, 0) };
    }
    if (name === "title" || name === "subtitle" || name === "org") return { text: SESSION[name] };
    if (name in pace) return { length: pace[name] };
    if (name in named) return { text: named[name] };
    const [id, field] = name.split(".");
    const part = parts[id];
    if (part && (field === "start" || field === "end")) return { time: toMinutes(part[field]) };
    if (part && field === "length") return { length: part.minutes };
    if (id === "links" && SESSION.links[field]) return { text: SESSION.links[field] };
    return null;
  }

  // "wish.end - nudge" becomes "11:15". With canonical, times stay 24-hour ("11:15") for the code that counts down.
  function evaluate(expression, canonical) {
    const [, body, modifier] = expression.match(/^(.*?)(?::(number|unit))?$/);
    const lower = body.charAt(0).toLowerCase() + body.slice(1);
    const [, name, sign, amount] = lower.match(/^([\w.]+)(?:\s*([+-])\s*(\w+))?$/) || [];
    let value = name ? lookup(name) : null;
    if (value && sign) {
      const shift = /^\d+$/.test(amount) ? Number(amount) : pace[amount];
      value = value.time !== undefined && typeof shift === "number"
        ? { time: value.time + (sign === "+" ? shift : -shift) }
        : null;
    }
    if (!value) return null;

    let text = value.text;
    if (value.time !== undefined) {
      text = canonical ? toTime(value.time) : clock(toTime(value.time));
    } else if (value.length !== undefined) {
      text = length(value.length);
      if (modifier && !Array.isArray(value.length)) text = String(split(value.length)[modifier === "number" ? 0 : 1]);
    }
    return body === lower ? text : text.charAt(0).toUpperCase() + text.slice(1);
  }

  function fill(text, canonical) {
    return text.replace(TOKEN, (whole, expression) => {
      const result = evaluate(expression.trim(), canonical);
      if (result === null) console.error("The session file doesn't know this time: " + whole);
      return result === null ? whole : result;
    });
  }


  // ---------- Fill in the session file, then the page ----------

  ["title", "subtitle", "org"].forEach((key) => { SESSION[key] = fill(SESSION[key]); });
  (function resolve(node) {
    Object.keys(node).forEach((key) => {
      const value = node[key];
      if (typeof value === "string") {
        if (key !== "code" && value.includes("{")) node[key] = fill(value, key === "until");
      } else if (value && typeof value === "object") {
        resolve(value);
      }
    });
  })(SESSION);

  document.querySelectorAll("[data-fill]").forEach((element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) walker.currentNode.nodeValue = fill(walker.currentNode.nodeValue);
    element.classList.add("filled");
  });

  return { fill: (text) => fill(text, false), clock };
})();
