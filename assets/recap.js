// From the room: each session's record shows one view at a time (Overview, Questions, Themes,
// Offers and asks, the Index), so a long record reads like a few short pages. Without this script
// every view shows, one after another, and the page still reads top to bottom.
// Every view and every item keeps its own address (#oct-9-questions, #oct-9-q-limits, #oct-9-r-portal),
// so a link from anywhere opens the right view, unfolds the right answer, and clears the index filter.

// Counts come from what's on the page, so they can't drift from it
document.querySelectorAll("[data-count]").forEach((spot) => {
  spot.textContent = document.querySelectorAll(spot.dataset.count).length;
});

// ---------- The tabs (the WAI-ARIA tabs pattern: arrow keys, Home, End) ----------
const recaps = [...document.querySelectorAll("[data-recap]")].map((recap) => {
  const bar = recap.querySelector(".recap-tabs");
  const tabs = [...recap.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

  function select(index, focus) {
    tabs.forEach((tab, i) => {
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
  }

  // If the reader had scrolled past the top of the new view, bring it up under the bar
  function toTop(index) {
    const top = panels[index].getBoundingClientRect().top + window.scrollY - bar.offsetHeight;
    if (window.scrollY > top) window.scrollTo({ top });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      select(i);
      history.replaceState(null, "", "#" + panels[i].id);
      toTop(i);
    });
    tab.addEventListener("keydown", (event) => {
      const last = tabs.length - 1;
      const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(next, true);
      history.replaceState(null, "", "#" + panels[next].id);
    });
  });

  panels.forEach((panel) => { panel.tabIndex = 0; });
  recap.classList.add("tabs-on");
  bar.hidden = false;
  select(0);
  return { recap, panels, select };
});

// ---------- Open every answer ----------
document.querySelectorAll("[data-open-all]").forEach((button) => {
  button.hidden = false;
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-pressed") !== "true";
    document.querySelectorAll(button.dataset.openAll).forEach((answer) => { answer.open = open; });
    button.setAttribute("aria-pressed", String(open));
  });
});

// ---------- The index filter: one kind at a time, or everything ----------
document.querySelectorAll(".res-filter").forEach((filter) => {
  const panel = filter.closest('[role="tabpanel"]');
  const blocks = [...panel.querySelectorAll(".res-block")];
  const buttons = [...filter.querySelectorAll("button")];
  filter.showKind = (kind) => {
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.kind === kind)));
    blocks.forEach((block) => { block.hidden = kind !== "all" && block.dataset.kind !== kind; });
  };
  buttons.forEach((button) => {
    const kind = button.dataset.kind;
    const items = kind === "all" ? panel.querySelectorAll(".res") : panel.querySelectorAll('.res-block[data-kind="' + kind + '"] .res');
    button.querySelector(".facet-count").textContent = items.length;
    button.addEventListener("click", () => filter.showKind(kind));
  });
  filter.hidden = false;
});

// ---------- Following a link to a view or an item ----------
function reveal(hash, onLoad) {
  let target = null;
  try { target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null; } catch (error) { return; }
  const owner = target && recaps.find(({ recap }) => recap.contains(target));
  if (!owner) return;
  const panel = target.closest('[role="tabpanel"]');
  owner.select(panel ? owner.panels.indexOf(panel) : 0);
  const block = target.closest(".res-block");
  if (block && block.hidden) block.closest('[role="tabpanel"]').querySelector(".res-filter").showKind("all");
  if (target.tagName === "DETAILS") target.open = true;
  // On arriving, jump as the browser does: a smooth scroll begun while the page is still settling lands short
  target.scrollIntoView({ block: "start", behavior: onLoad ? "instant" : "auto" });
  const focusable = target.tagName === "DETAILS" ? target.querySelector("summary") : target;
  if (!focusable.matches("a, button, summary, [tabindex]")) focusable.tabIndex = -1;
  focusable.focus({ preventScroll: true });
}
window.addEventListener("hashchange", () => reveal(location.hash));
// A link to the address the page is already at fires no hashchange, so follow it by hand
document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (link && link.getAttribute("role") !== "tab" && link.hash === location.hash) reveal(link.hash);
});
reveal(location.hash, true);
