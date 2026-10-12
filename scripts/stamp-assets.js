// Writes the stamps into every page: node scripts/stamp-assets.js
// Run it after changing a stylesheet or a script (scripts/stamps.js says why); the checks stop a commit whose
// stamps are out of date and say so.
const fs = require("fs");
const path = require("path");
const { stamp } = require("./stamps.js");

const root = path.join(__dirname, "..");
let changed = 0;
fs.readdirSync(root).filter((file) => file.endsWith(".html")).forEach((page) => {
  const file = path.join(root, page);
  const before = fs.readFileSync(file, "utf8");
  const after = stamp(root, before);
  if (after === before) return;
  fs.writeFileSync(file, after);
  changed++;
  console.log("stamped " + page);
});
console.log(changed ? changed + " page" + (changed === 1 ? "" : "s") + " restamped" : "every stamp is current");
