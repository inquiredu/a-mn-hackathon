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

let screenNumber = 0;
SESSION.segments.forEach((segment, s) => {
  const card = el("article", "segment" + (segment.where === "Breakout rooms" ? " rooms" : ""));

  const head = el("div", "segment-head");
  head.append(el("time", "", segment.start + " to " + segment.end), el("h3", "", segment.title), el("span", "where", segment.where));
  card.append(head, el("p", "participants", "Participants see: " + segment.hint));

  // On the stage: each screen, linked to the presenter view at that screen
  card.append(el("h4", "", "On the stage"));
  const stage = el("ol", "stage-list");
  stage.start = screenNumber + 1;
  segment.screens.forEach((screen) => {
    const li = el("li");
    li.append(linkTo("present.html#" + screenNumber, screen.heading || screen.text));
    if (screen.note) li.append(el("span", "note", screen.note));
    stage.append(li);
    screenNumber++;
  });
  card.append(stage);

  // Hosts' checklist, remembered in this browser
  if (segment.host && segment.host.length) {
    card.append(el("h4", "", "Hosts"));
    const list = el("ul", "checklist");
    segment.host.forEach((task, t) => {
      const key = "hands-on-check-" + s + "-" + t;
      const box = el("input");
      box.type = "checkbox";
      box.checked = recall(key) === "1";
      box.addEventListener("change", () => remember(key, box.checked ? "1" : "0"));
      const label = el("label");
      label.append(box, el("span", "", task));
      const li = el("li");
      li.append(label);
      list.append(li);
    });
    card.append(list);
  }

  // Messages, ready to paste
  if (segment.messages && segment.messages.length) {
    card.append(el("h4", "", "Ready to paste"));
    segment.messages.forEach((message) => {
      const box = el("div", "message");
      const copy = el("button", "", "Copy");
      copy.type = "button";
      copy.setAttribute("aria-label", "Copy the message for " + message.to);
      copy.addEventListener("click", () => copyText(message.text, "Copied. Paste it into " + message.to.toLowerCase() + "."));
      box.append(el("p", "to", "To: " + message.to), el("pre", "", message.text), copy);
      card.append(box);
    });
  }

  $("ros").append(card);
});
