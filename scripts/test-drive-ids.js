// Tests for reading a Google address for its ID: node scripts/test-drive-ids.js
// The level 3 scripts' settings lines are filled from these, so a wrong ID here is a script that fails to run.
const assert = require("assert");
const D = require("../assets/drive-ids.js");

const FOLDER = "1AbCdEfGhIjKlMnOpQrStUvWxYz012345";   // 33 characters, the shape of a folder's ID
const DOC = "1Zy_XwVuTsRqPoNmLkJiHgFeDcBa9876543210-AbCdEf";
const SHEET = "1QwErTyUiOpAsDfGhJkLzXcVbNm1234567890_qwerty";

// Folders, the ways a browser shows them
assert.deepStrictEqual(D.read("https://drive.google.com/drive/folders/" + FOLDER, "folder"), { id: FOLDER, kind: "folder" });
assert.deepStrictEqual(D.read("https://drive.google.com/drive/folders/" + FOLDER + "?usp=sharing", "folder"), { id: FOLDER, kind: "folder" }, "stops before ?");
assert.deepStrictEqual(D.read("https://drive.google.com/drive/u/1/folders/" + FOLDER + "?usp=drive_link", "folder"), { id: FOLDER, kind: "folder" }, "a second signed-in account");
assert.deepStrictEqual(D.read("  drive.google.com/drive/folders/" + FOLDER + "  ", "folder"), { id: FOLDER, kind: "folder" }, "no https, and spaces around it");
assert.deepStrictEqual(D.read("https://drive.google.com/drive/folders/" + FOLDER + "#grid", "folder"), { id: FOLDER, kind: "folder" }, "stops before #");
assert.deepStrictEqual(D.read("https://drive.google.com/open?id=" + FOLDER, "folder"), { id: FOLDER, kind: "folder", assumed: true }, "an open?id= link can't say its kind");
assert.deepStrictEqual(D.read(FOLDER, "folder"), { id: FOLDER, kind: "folder", assumed: true }, "a bare ID");

// Docs and Sheets
assert.deepStrictEqual(D.read("https://docs.google.com/document/d/" + DOC + "/edit?tab=t.0", "doc"), { id: DOC, kind: "doc" });
assert.deepStrictEqual(D.read("https://docs.google.com/document/u/0/d/" + DOC + "/edit", "doc"), { id: DOC, kind: "doc" });
assert.deepStrictEqual(D.read("https://docs.google.com/spreadsheets/d/" + SHEET + "/edit#gid=0", "sheet"), { id: SHEET, kind: "sheet" });

// The wrong kind says what it is and what's wanted
assert.match(D.read("https://docs.google.com/document/d/" + DOC + "/edit", "folder").problem, /a Google Doc\. This line wants a folder/);
assert.match(D.read("https://docs.google.com/spreadsheets/d/" + SHEET + "/edit", "doc").problem, /a Google Sheet\. This line wants a Google Doc/, "the Multiplier's old slip: the Sheet on the Doc's line");
assert.match(D.read("https://drive.google.com/drive/folders/" + FOLDER, "doc").problem, /a folder\. This line wants a Google Doc/);
assert.match(D.read("https://drive.google.com/file/d/" + DOC + "/view", "doc").problem, /a file in Drive/);
assert.match(D.read("https://docs.google.com/presentation/d/" + DOC + "/edit", "doc").problem, /a Slides file/);

// Lists, half addresses, and words
assert.match(D.read("https://drive.google.com/drive/my-drive", "folder").problem, /a list in Drive/);
assert.match(D.read("https://drive.google.com/drive/u/0/shared-with-me", "folder").problem, /a list in Drive/);
assert.match(D.read("https://drive.google.com/drive/folders/", "folder").problem, /No ID in that address/);
assert.match(D.read("my grade 7 folder", "folder").problem, /doesn't look like an address/);
assert.match(D.read("abc123", "folder").problem, /doesn't look like an address/, "too short to be an ID");
assert.strictEqual(D.read("Grade7-Science-Folder", "folder").assumed, true, "a long name passes for an ID, and says it's a guess");
assert.deepStrictEqual(D.read("https://drive.google.com/drive/mobile/folders/" + FOLDER, "folder"), { id: FOLDER, kind: "folder" }, "Drive's phone address");
assert.deepStrictEqual(D.read("", "folder"), { problem: "" }, "empty is no problem yet");
assert.deepStrictEqual(D.read(undefined, "folder"), { problem: "" });

// Filling the settings line
const script = '// Drive inventory\nconst FOLDER_ID = "PASTE_THE_FOLDER_ID_HERE";\n\nfunction inventory() {\n  const root = DriveApp.getFolderById(FOLDER_ID);\n}\n';
const filled = D.fill(script, { FOLDER_ID: FOLDER });
assert.ok(filled.includes('const FOLDER_ID = "' + FOLDER + '";'), "the placeholder is replaced");
assert.strictEqual(filled.replace(FOLDER, "PASTE_THE_FOLDER_ID_HERE"), script, "and nothing else changes");
assert.strictEqual(D.fill(filled, { FOLDER_ID: DOC }).includes(DOC), true, "a second fill replaces the first ID");
assert.strictEqual(D.fill(script, { FOLDER_ID: '"; DriveApp.getRootFolder().setTrashed(true); "' }), script, "only an ID goes in");
assert.strictEqual(D.fill(script, { FOLDER_ID: "" }), script, "an empty value leaves the placeholder");
assert.strictEqual(D.fill(script, {}), script);
const two = 'const TEMPLATE_ID = "PASTE_THE_DOC_ID_HERE";\nconst OTHER = "keep";\n';
assert.strictEqual(D.fill(two, { TEMPLATE_ID: DOC }), 'const TEMPLATE_ID = "' + DOC + '";\nconst OTHER = "keep";\n', "only the named line");
const mentioned = '// Change const FOLDER_ID = "PASTE_THE_FOLDER_ID_HERE" below\nconst FOLDER_ID = "PASTE_THE_FOLDER_ID_HERE";\n';
assert.strictEqual(D.fill(mentioned, { FOLDER_ID: FOLDER }), '// Change const FOLDER_ID = "PASTE_THE_FOLDER_ID_HERE" below\nconst FOLDER_ID = "' + FOLDER + '";\n', "a comment that names the line stays as it is");

console.log("drive id tests: all pass");
