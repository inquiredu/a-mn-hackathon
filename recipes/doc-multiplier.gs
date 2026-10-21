// Google Apps Script: code to paste into Apps Script, not a prompt for an AI chat.
// Doc multiplier: one copy of a template Doc for every row of this Sheet, each named for its row,
// gathered in a new folder, with each copy's link written back into column B.
// It lives inside your Sheet (a bound script): open the Sheet, choose Extensions > Apps Script, and paste it there.
// 1. TEMPLATE_ID: the Doc to copy. (Open it: the ID is the long code between /d/ and /edit in its address.)
// 2. This Sheet's first tab: a heading in row 1, then one name per row in column A. Column B gets the links.
// 3. Choose "multiply" and press Run. The first run asks to see your Drive and your Sheets. Read it, then allow.
// Practice with made-up names: "Team Loon", "Team Otter", not students.

const TEMPLATE_ID = "PASTE_THE_DOC_ID_HERE";

function multiply() {
  const template = DriveApp.getFileById(TEMPLATE_ID);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];   // the Sheet this script lives in
  const rows = sheet.getDataRange().getValues();
  const folder = DriveApp.createFolder("Copies of " + template.getName());
  let made = 0;
  for (let r = 1; r < rows.length; r++) {
    const name = String(rows[r][0]).trim();
    if (!name) continue;
    const copy = template.makeCopy(template.getName() + " · " + name, folder);
    sheet.getRange(r + 1, 2).setValue(copy.getUrl());
    made++;
  }
  Logger.log(made + " copies made. Open the folder: " + folder.getUrl());
}
