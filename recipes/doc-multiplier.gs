// Doc multiplier: one copy of a template Doc for every row in a Sheet, each named for its row,
// gathered in a new folder, with each copy's link written back into the Sheet.
// 1. TEMPLATE_ID: the Doc to copy. (Open it: the ID is the long string after /d/ in the address.)
// 2. SHEET_ID: a Sheet whose first column holds one name per row, with a heading in row 1. Column B gets the links.
// 3. Choose "multiply" and press Run. The first run asks to see your Drive and Sheets. Read it, then allow.
// Practice with made-up names: "Team Loon", "Team Otter", not students.

const TEMPLATE_ID = "PASTE_THE_DOC_ID_HERE";
const SHEET_ID = "PASTE_THE_SHEET_ID_HERE";

function multiply() {
  const template = DriveApp.getFileById(TEMPLATE_ID);
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
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
