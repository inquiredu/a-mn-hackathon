// The Hosts page: the run of show and the room calculator, built from the session file.
// Uses el(), linkTo(), copyText(), remember(), and recall() from site.js.

// ---------- How many rooms? ----------

function roomPlan(people, size) {
  const rooms = Math.max(1, Math.ceil(people / size));
  const small = Math.floor(people / rooms);
  const big = people % rooms;               // this many rooms get one extra person
  const parts = [];
  if (big) parts.push(big + (big === 1 ? " room of " : " rooms of ") + (small + 1));
  if (rooms - big) parts.push((rooms - big) + (rooms - big === 1 ? " room of " : " rooms of ") + small);
  return rooms + (rooms === 1 ? " room: " : " rooms: ") + parts.join(" and ") + ".";
}

const builders = $("builders");
const showPlan = () => {
  const n = Math.round(Number(builders.value));
  $("calc-out").textContent = n > 0 ? roomPlan(n, 4) : "Enter how many people are building.";
};
builders.addEventListener("input", showPlan);
showPlan();


// ---------- The run of show ----------

// Each part folds. During the session the part that's on opens by itself; any other time, all start closed, so the run of show reads as a list.
const live = phase();

function cueLines(note) {
  const box = el("span", "note");
  note.split(/(?=\b(?:Say|Do|Co-host):)/).forEach((part) => {
    const m = part.match(/^(Say|Do|Co-host):\s*([\s\S]*)$/);
    const line = el("span", "cue-line");
    if (m) line.append(el("span", "cue-who", m[1]), m[2].trim());
    else line.append(part.trim());
    if (line.textContent.trim()) box.append(line);
  });
  return box;
}

// A ready-to-paste message: its blanks, like "(your planner link)", stand out, and the box says how many there are
function messageText(text) {
  const pre = el("pre");
  const parts = text.split(/(\(your [a-z]+ link\))/);
  parts.forEach((part) => pre.append(/^\(your [a-z]+ link\)$/.test(part) ? el("span", "blank-chip", part) : part));
  return { pre, blanks: (parts.length - 1) / 2 };
}

// The run of show as one bar, each part as long as its minutes: main room and breakout rooms told apart
if ($("ros-bar")) {
  let at = 0;
  SESSION.segments.forEach((segment) => {
    const part = el("span", "ros-part" + (segment.where === "Breakout rooms" ? " rooms" : ""));
    part.style.flexGrow = segment.minutes;
    part.append(el("span", "ros-name", segment.title), el("span", "ros-at", Math.floor(at / 60) + ":" + String(at % 60).padStart(2, "0")));
    at += segment.minutes;
    $("ros-bar").append(part);
  });
}
let screenNumber = 0;
SESSION.segments.forEach((segment, s) => {
  const card = el("details", "segment" + (segment.where === "Breakout rooms" ? " rooms" : ""));
  card.id = "part-" + segment.id;
  card.open = live.mode === "during" && live.index === s;

  const head = el("summary", "segment-head");
  const progress = el("span", "progress");
  head.append(el("span", "length", segment.minutes + " min"), el("h3", "", segment.title), el("span", "where", segment.where), progress);
  card.append(head, el("p", "participants", "Participants see: " + segment.hint));

  // On the stage: each screen, linked to the presenter view at that screen
  card.append(el("h4", "", "On the stage"));
  const stage = el("ul", "stage-list");
  segment.screens.forEach((screen) => {
    const li = el("li");
    li.append(el("span", "screen-no", "Screen " + (screenNumber + 1)), linkTo("present.html#" + screenNumber, screen.heading || screen.text));
    if (screen.note) li.append(cueLines(screen.note));
    stage.append(li);
    screenNumber++;
  });
  card.append(stage);

  // Hosts' checklist, remembered in this browser
  if (segment.host && segment.host.length) {
    const title = el("h4", "", "Checklist");
    card.append(title);
    const list = el("ul", "checklist");
    const count = () => {
      const done = list.querySelectorAll("input:checked").length;
      const text = done + " of " + segment.host.length + " done";
      progress.textContent = done ? text : "";
      title.textContent = "Checklist · " + text;
    };
    segment.host.forEach((task, t) => {
      const key = "hands-on-check-" + s + "-" + t;
      const box = el("input");
      box.type = "checkbox";
      box.checked = recall(key) === "1";
      box.addEventListener("change", () => { remember(key, box.checked ? "1" : "0"); count(); });
      const label = el("label");
      label.append(box, el("span", "", task));
      const li = el("li");
      li.append(label);
      list.append(li);
    });
    card.append(list);
    count();
  }

  // Messages, ready to paste
  if (segment.messages && segment.messages.length) {
    card.append(el("h4", "", "Ready to paste"));
    segment.messages.forEach((message) => {
      const box = el("div", "message");
      const copy = el("button", "", "Copy");
      copy.type = "button";
      const filled = TIMES.fill(message.text);
      copy.setAttribute("aria-label", "Copy the message for " + message.to + ": " + filled.split("\n")[0].slice(0, 60));
      copy.addEventListener("click", () => copyText(filled, null, copy));
      const { pre, blanks } = messageText(filled);
      const head = el("div", "message-head");
      head.append(el("p", "to", "To: " + message.to), copy);
      box.append(head, pre);
      if (blanks) box.append(el("p", "blank-note", blanks === 1 ? "Has a blank: paste your own link over it after copying." : "Has " + blanks + " blanks: paste your own links over them after copying."));
      card.append(box);
    });
  }

  $("ros").append(card);
});

// The now bar can point at the part that's on now that the parts have addresses
if (typeof update === "function") update();


// ---------- The parts in order, with how far into the session each one starts ----------

if ($("parts-in-order")) {
  let at = 0;
  const parts = SESSION.segments.map((s) => {
    const label = s.title + " at " + Math.floor(at / 60) + ":" + String(at % 60).padStart(2, "0");
    at += s.minutes;
    return label;
  });
  $("parts-in-order").textContent = "In order, counted from the start: " + parts.join(" · ") + " · ends at " + Math.floor(at / 60) + ":" + String(at % 60).padStart(2, "0") + ".";
}

// Links straight to the first run's files, where a step names them
document.querySelectorAll("[data-record-link]").forEach((a) => {
  const url = (SESSION.record || {})[a.dataset.recordLink];
  if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
});


// ---------- How the first run went: the record, from the session file ----------

document.querySelectorAll("[data-record]").forEach((box) => {
  const record = SESSION.record || {};
  const ran = el("p", "", "Run live as " + (record.ran || "the first session") + ", for about forty K-12 educators and leaders on Google Meet, most of whom had never coded. Its shared files are view-only now, kept so you can see the shape of them and copy them:");
  const list = el("ul");
  [["planner", "The Breakout Planner from the first run"], ["gallery", "The walls deck: the gallery wall"], ["wonder", "The walls deck: I wonder"], ["worry", "The walls deck: I worry"]].forEach(([key, label]) => {
    if (!record[key]) return;
    const a = linkTo(record[key], label);
    a.target = "_blank";
    a.rel = "noopener";
    const li = el("li");
    li.append(a);
    list.append(li);
  });
  const lines = el("p", "", "At the close, the first run pointed to its next session: \"" + (record.next || "") + "\" The stage's last screen now says only thank you until a copy of the kit fills its next line; the invitation on Home before the day and the welcome note (\"a month into the school year\") were that day's too.");
  box.replaceChildren(ran, list, lines);
});
