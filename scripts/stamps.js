// The stamps that keep a page and its stylesheets and scripts together. GitHub Pages lets a browser keep a file for
// ten minutes, so without them a visitor who came by just before a change gets the new page with the old styles:
// cards as bare lists, pictures squeezed into the wrong row. So every local .css and .js a page loads is written with
// ?v= and the first eight characters of its contents' SHA-256; a changed file gets a new address, and the browser
// fetches it with the page. stamp-assets.js writes them; check-session.js fails on any that don't match.
//
// The session file goes unstamped: hosts edit it in the browser on GitHub, where nothing can restamp a page, and a
// stale copy only means a stale time or link for those ten minutes.
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const UNSTAMPED = new Set(["assets/session.js"]);
const REFERENCE = /(\s(?:href|src)=")(assets\/[^"?#]+\.(?:css|js))(?:\?v=([0-9a-f]*))?"/g;

const stampOf = (root, file) => crypto.createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex").slice(0, 8);

// A page's text with every stamp made current
function stamp(root, html) {
  return html.replace(REFERENCE, (whole, attribute, file) =>
    attribute + file + (UNSTAMPED.has(file) ? "" : "?v=" + stampOf(root, file)) + '"');
}

// What's out of date, page by page, in words
function problems(root, pages) {
  const out = [];
  pages.forEach((page) => {
    for (const [, , file, found] of fs.readFileSync(path.join(root, page), "utf8").matchAll(REFERENCE)) {
      if (UNSTAMPED.has(file)) {
        if (found !== undefined) out.push(page + ": " + file + " should load without a stamp; run node scripts/stamp-assets.js");
        continue;
      }
      if (!fs.existsSync(path.join(root, file))) { out.push(page + ": loads " + file + ", which doesn't exist"); continue; }
      const current = stampOf(root, file);
      if (found !== current) {
        out.push(page + ": " + file + (found ? " is stamped " + found + ", but its contents are now " + current : " has no stamp")
          + "; run node scripts/stamp-assets.js");
      }
    }
  });
  return out;
}

module.exports = { stamp, problems };
