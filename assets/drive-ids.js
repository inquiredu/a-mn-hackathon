// Reading a Google address for its ID: the folder, Doc, or Sheet a level 3 script points at.
// Someone pastes the address from their browser; the script's settings line wants only the long code inside it.
// Pure functions (tested in scripts/test-drive-ids.js): nothing here is saved or sent anywhere.

const DRIVE_IDS = (() => {
  // A Drive ID: letters, digits, - and _. Real ones run 19 to 44 characters. Inside an address the place says it's an
  // ID; typed alone, a long name ("Grade7-Science-Folder") can look like one too, so a bare ID comes back as assumed.
  const ID = "[A-Za-z0-9_-]{19,}";
  const BARE = new RegExp("^" + ID + "$");

  // What an address points at, read from its path. The /u/0/ that a second signed-in account adds is skipped.
  const SHAPES = [
    { kind: "folder", pattern: new RegExp("drive\\.google\\.com/(?:drive/)?(?:u/\\d+/)?(?:mobile/)?folders/(" + ID + ")") },
    { kind: "doc", pattern: new RegExp("docs\\.google\\.com/document/(?:u/\\d+/)?d/(" + ID + ")") },
    { kind: "sheet", pattern: new RegExp("docs\\.google\\.com/spreadsheets/(?:u/\\d+/)?d/(" + ID + ")") },
    { kind: "slides", pattern: new RegExp("docs\\.google\\.com/presentation/(?:u/\\d+/)?d/(" + ID + ")") },
    { kind: "form", pattern: new RegExp("docs\\.google\\.com/forms/(?:u/\\d+/)?d/(" + ID + ")") },
    { kind: "file", pattern: new RegExp("drive\\.google\\.com/file/(?:u/\\d+/)?d/(" + ID + ")") },
    { kind: "unknown", pattern: new RegExp("drive\\.google\\.com/open\\?(?:[^#]*&)?id=(" + ID + ")") }
  ];

  const NAMES = { folder: "a folder", doc: "a Google Doc", sheet: "a Google Sheet", slides: "a Slides file", form: "a Form", file: "a file in Drive (not a Google Doc, Sheet, or folder)" };

  // { id, kind } when the text holds an address (or a bare ID) of the kind wanted; { problem } in plain words when not.
  // want: "folder", "doc", or "sheet". A bare ID or an open?id= address can't say its kind, so it's taken as the kind wanted.
  function read(text, want) {
    const value = String(text || "").trim();
    if (!value) return { problem: "" };
    if (BARE.test(value)) return { id: value, kind: want, assumed: true };
    for (const { kind, pattern } of SHAPES) {
      const match = value.match(pattern);
      if (!match) continue;
      if (kind === "unknown") return { id: match[1], kind: want, assumed: true };
      if (kind === want) return { id: match[1], kind };
      return { problem: "That's the address of " + NAMES[kind] + ". This line wants " + NAMES[want] + ": open it, and copy the address from the bar at the top." };
    }
    if (/drive\.google\.com\/drive\/(?:u\/\d+\/)?(?:my-drive|home|shared-with-me|recent|starred|shared-drives)/.test(value)) {
      return { problem: "That's a list in Drive, not one folder. Double-click your folder to open it, then copy the address." };
    }
    if (/^https?:\/\//.test(value) || /google\.com/.test(value)) {
      return { problem: "No ID in that address. Open " + NAMES[want] + " itself and copy the whole address from the bar at the top." };
    }
    return { problem: "That doesn't look like an address. Copy it from the bar at the top of the browser, while " + NAMES[want] + " is open." };
  }

  // The script with each settings line's placeholder replaced by an ID. values: { FOLDER_ID: "1AbC…" }. Only a line
  // that starts with the setting (never a mention of it in a comment) is changed.
  // Only an ID that is all letters, digits, - and _ goes in, so nothing typed here can change the code around it.
  function fill(script, values) {
    let out = String(script);
    Object.entries(values || {}).forEach(([name, id]) => {
      if (!id || !BARE.test(id)) return;
      out = out.replace(new RegExp("^(const\\s+" + name + "\\s*=\\s*\")[^\"\\n]*(\")", "m"), "$1" + id + "$2");
    });
    return out;
  }

  return { read, fill };
})();

if (typeof module !== "undefined") module.exports = DRIVE_IDS;
