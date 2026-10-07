// The Sources page: paths, section tabs, topics, kinds, search, and shareable links.
// Reads SOURCES, SOURCE_SECTIONS, TYPES, ASK_GROUPS, ASKS, and PATHS from sources-data.js.
// Uses el(), linkTo(), copyText(), and say() from site.js.
//
// Every view has its own address, so a host can paste it into a chat:
//   sources.html?ask=privacy          one topic
//   sources.html?section=care         one section
//   sources.html?type=research,policy  kinds of source
//   sources.html?q=gemini             a search
//   sources.html?path=leaders         a start-here path
//   sources.html#primm                one source, opened

const state = { section: "all", ask: "", types: new Set(), q: "", path: "" };
let expandAll = false;
const byId = Object.fromEntries(SOURCES.map((s) => [s.id, s]));


// ---------- Reading and writing the address ----------

function readAddress() {
  const p = new URLSearchParams(location.search);
  state.section = SOURCE_SECTIONS[p.get("section")] ? p.get("section") : "all";
  state.ask = ASKS[p.get("ask")] ? p.get("ask") : "";
  state.types = new Set((p.get("type") || "").split(",").filter((t) => TYPES[t]));
  state.q = p.get("q") || "";
  state.path = PATHS[p.get("path")] ? p.get("path") : "";
}

function writeAddress() {
  const p = new URLSearchParams();
  if (state.path) p.set("path", state.path);
  if (state.section !== "all") p.set("section", state.section);
  if (state.ask) p.set("ask", state.ask);
  if (state.types.size) p.set("type", [...state.types].join(","));
  if (state.q) p.set("q", state.q);
  const query = p.toString();
  history.replaceState(null, "", location.pathname + (query ? "?" + query : ""));
}


// ---------- Matching ----------

function matches(s, skip = "") {
  if (skip !== "section" && state.section !== "all" && s.section !== state.section) return false;
  if (skip !== "ask" && state.ask && !s.asks.includes(state.ask)) return false;
  if (skip !== "type" && state.types.size && !state.types.has(s.type)) return false;
  if (state.q) {
    // Each topic's key counts too, so "security" finds every source on code safety
    const text = [s.title, s.who, s.venue, s.when, s.group, s.says, s.take, TYPES[s.type]].concat(s.asks.flatMap((a) => [ASKS[a], a])).join(" ").toLowerCase();
    if (!state.q.toLowerCase().split(/\s+/).filter(Boolean).every((word) => text.includes(word))) return false;
  }
  return true;
}

function shown() {
  if (state.path) return PATHS[state.path].ids.map((id) => byId[id]).filter(Boolean);
  return SOURCES.filter((s) => matches(s));
}

function anyFilter() {
  return state.path || state.section !== "all" || state.ask || state.types.size || state.q;
}


// ---------- Start here: the paths ----------

Object.entries(PATHS).forEach(([key, path]) => {
  const button = el("button", "path-card");
  button.type = "button";
  button.dataset.path = key;
  button.append(el("strong", "", path.title), el("span", "", path.blurb), el("span", "path-count", path.ids.length + " sources"));
  button.addEventListener("click", () => {
    const leaving = state.path === key;
    Object.assign(state, { section: "all", ask: "", types: new Set(), q: "", path: leaving ? "" : key });
    $("q").value = "";
    render();
    if (!leaving) $("browse-title").focus();
  });
  $("paths").append(button);
});


// ---------- Section tabs, topics, and kinds ----------

function choice(type, name, value, label, checked) {
  const id = name + "-" + (value || "all");
  const input = el("input");
  input.type = type;
  input.name = name;
  input.id = id;
  input.value = value;
  input.checked = checked;
  const lab = el("label");
  lab.htmlFor = id;
  const count = el("span", "facet-count");
  lab.append(el("span", "", label), count);
  const row = el("div", "choice");
  row.append(input, lab);
  return { row, input, count };
}

const tabButtons = {};
[["all", "Everything"]].concat(Object.entries(SOURCE_SECTIONS).map(([k, v]) => [k, v.title])).forEach(([key, label]) => {
  const button = el("button", "tab");
  button.type = "button";
  button.append(el("span", "", label), el("span", "facet-count"));
  button.addEventListener("click", () => { state.section = key; state.path = ""; render(); });
  tabButtons[key] = button;
  $("tabs").append(button);
});

// The topics: "Anything", then each group under its own small heading
const askInputs = {};
function askChoice(key, label, parent) {
  const c = choice("radio", "ask", key, label, key === state.ask);
  c.input.addEventListener("change", () => { state.ask = key; state.path = ""; render(); });
  askInputs[key] = c;
  parent.append(c.row);
}
askChoice("", "Anything", $("asks"));
ASK_GROUPS.forEach((group) => {
  const set = el("fieldset", "ask-group");
  set.append(el("legend", "", group.title));
  Object.entries(group.asks).forEach(([key, label]) => askChoice(key, label, set));
  $("asks").append(set);
});

const kindInputs = {};
Object.entries(TYPES).forEach(([key, label]) => {
  const c = choice("checkbox", "kind", key, label, false);
  c.input.addEventListener("change", () => {
    if (c.input.checked) state.types.add(key); else state.types.delete(key);
    state.path = "";
    render();
  });
  kindInputs[key] = c;
  $("kinds").append(c.row);
});

let searchTimer;
$("q").addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { state.q = $("q").value.trim(); state.path = ""; render(); }, 150);
});

$("clear").addEventListener("click", () => {
  Object.assign(state, { section: "all", ask: "", types: new Set(), q: "", path: "" });
  $("q").value = "";
  render();
});

$("expand").addEventListener("click", () => {
  expandAll = !expandAll;
  $("expand").setAttribute("aria-pressed", String(expandAll));
  $("expand").textContent = expandAll ? "Close every summary" : "Open every summary";
  document.querySelectorAll(".src-toggle").forEach((b) => setOpen(b, expandAll));
});

// On small screens the filters fold away behind one button
$("finder-toggle").addEventListener("click", () => {
  const open = $("finder-toggle").getAttribute("aria-expanded") !== "true";
  $("finder-toggle").setAttribute("aria-expanded", String(open));
  $("finder-panel").classList.toggle("open", open);
});


// ---------- One source, as a card ----------

function setOpen(button, open) {
  button.setAttribute("aria-expanded", String(open));
  button.textContent = open ? "Hide what it says" : "What it says";
  button.panel.hidden = !open;
}

function card(s, headingLevel, position) {
  const article = el("article", "src");
  article.id = s.id;

  const heading = el("h" + headingLevel, "src-title");
  if (position) heading.append(el("span", "src-step", position + ". "));
  const link = linkTo(s.url, s.title);
  link.target = "_blank";
  link.rel = "noopener";
  heading.append(link);

  const meta = el("p", "src-meta", [s.who, s.venue, s.when].filter(Boolean).join(" · ") + " ");
  meta.append(el("span", "type", TYPES[s.type]));
  if (s.peer) meta.append(" ", el("span", "type peer", "Peer-reviewed"));

  const take = el("p", "src-take");
  take.append(el("strong", "", s.takeLabel + ": "), s.take);

  const more = el("div", "src-says");
  more.id = "says-" + s.id;
  more.append(el("p", "", s.says));
  if (s.also) {
    const also = el("p", "src-also", "See also: ");
    s.also.forEach((a, i) => {
      if (i) also.append(", ");
      const l = linkTo(a.url, a.label);
      l.target = "_blank";
      l.rel = "noopener";
      also.append(l);
    });
    more.append(also);
  }

  const foot = el("div", "src-foot");
  const toggle = el("button", "src-toggle");
  toggle.type = "button";
  toggle.setAttribute("aria-controls", more.id);
  toggle.panel = more;
  toggle.addEventListener("click", () => setOpen(toggle, toggle.getAttribute("aria-expanded") !== "true"));

  const tags = el("p", "src-tags");
  tags.append(el("span", "sr-only", "Topics: "));
  s.asks.forEach((a) => {
    const tag = el("button", "tag-chip" + (a === state.ask ? " on" : ""), ASKS[a]);
    tag.type = "button";
    tag.setAttribute("aria-label", "Show sources on: " + ASKS[a]);
    tag.addEventListener("click", () => {
      Object.assign(state, { ask: a, path: "", section: "all" });
      render();
      $("browse-title").focus();
    });
    tags.append(tag);
  });

  const share = el("button", "src-link", "Copy link");
  share.type = "button";
  share.setAttribute("aria-label", "Copy a link to " + s.title);
  share.addEventListener("click", () => copyText(location.origin + location.pathname + "#" + s.id, "Link copied."));

  foot.append(toggle, tags, share);
  article.append(heading, meta, take, more, foot);
  setOpen(toggle, expandAll);
  return article;
}


// ---------- Drawing the results ----------

function render() {
  const list = shown();

  // Section tabs and their counts
  Object.entries(tabButtons).forEach(([key, button]) => {
    const n = SOURCES.filter((s) => (key === "all" || s.section === key) && matches(s, "section")).length;
    button.querySelector(".facet-count").textContent = state.path ? "" : n;
    button.setAttribute("aria-pressed", String(!state.path && state.section === key));
  });
  // Topics and their counts. A topic with nothing in this view steps out of the list,
  // unless it's the one chosen, and a group with no topics left goes with it.
  Object.entries(askInputs).forEach(([key, c]) => {
    c.input.checked = !state.path && key === state.ask;
    const n = SOURCES.filter((s) => (!key || s.asks.includes(key)) && matches(s, "ask")).length;
    c.count.textContent = n;
    c.row.classList.toggle("empty", n === 0);
    c.row.hidden = Boolean(key) && n === 0 && !c.input.checked;
  });
  document.querySelectorAll(".ask-group").forEach((set) => {
    set.hidden = !set.querySelector(".choice:not([hidden])");
  });
  // Kinds and their counts, the same way
  Object.entries(kindInputs).forEach(([key, c]) => {
    c.input.checked = !state.path && state.types.has(key);
    const n = SOURCES.filter((s) => s.type === key && matches(s, "type")).length;
    c.count.textContent = n;
    c.row.classList.toggle("empty", n === 0);
    c.row.hidden = n === 0 && !c.input.checked;
  });
  $("kinds").closest("fieldset").hidden = !$("kinds").querySelector(".choice:not([hidden])");
  // Paths
  document.querySelectorAll(".path-card").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.path === state.path)));

  // The count, and the path banner
  $("count").textContent = state.path
    ? PATHS[state.path].title + " " + list.length + " sources, in reading order."
    : (anyFilter() ? "Showing " + list.length + " of " + SOURCES.length + " sources." : "All " + SOURCES.length + " sources.");
  const banner = $("path-banner");
  banner.hidden = !state.path;
  if (state.path) {
    const back = el("button", "", "Show every source");
    back.type = "button";
    back.addEventListener("click", () => { state.path = ""; render(); });
    banner.replaceChildren(el("p", "", PATHS[state.path].blurb), back);
  }

  // The cards
  const results = $("results");
  results.replaceChildren();
  if (!list.length) {
    const empty = el("div", "empty-state");
    empty.append(el("p", "", "Nothing matches all of that. Try fewer filters, or a different word."));
    const reset = el("button", "primary", "Clear filters");
    reset.type = "button";
    reset.addEventListener("click", () => $("clear").click());
    empty.append(reset);
    results.append(empty);
  } else if (state.path) {
    const ol = el("div", "src-list");
    list.forEach((s, i) => ol.append(card(s, 3, i + 1)));
    results.append(ol);
  } else {
    Object.entries(SOURCE_SECTIONS).forEach(([key, section]) => {
      const inSection = list.filter((s) => s.section === key);
      if (!inSection.length) return;
      const block = el("section", "src-section");
      block.append(el("h3", "", section.title));
      if (!anyFilter() || state.section === key) block.append(el("p", "src-section-blurb", section.blurb));
      [...new Set(inSection.map((s) => s.group))].forEach((group) => {
        block.append(el("h4", "src-group", group));
        const wrap = el("div", "src-list");
        inSection.filter((s) => s.group === group).forEach((s) => wrap.append(card(s, 5)));
        block.append(wrap);
      });
      results.append(block);
    });
  }

  writeAddress();
}


// ---------- Get started ----------

readAddress();
$("q").value = state.q;

// A link to one source (sources.html#primm): show everything, open that card, and bring it into view
function openSource(id) {
  if (!byId[id]) return false;
  Object.assign(state, { section: "all", ask: "", types: new Set(), q: "", path: "" });
  $("q").value = "";
  render();
  const article = $(id);
  setOpen(article.querySelector(".src-toggle"), true);
  article.classList.add("highlight");
  article.scrollIntoView({ block: "start" });
  history.replaceState(null, "", location.pathname + "#" + id);
  return true;
}
window.addEventListener("hashchange", () => openSource(location.hash.slice(1)));
if (!openSource(location.hash.slice(1))) render();
