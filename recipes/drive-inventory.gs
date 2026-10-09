// Drive inventory: every file in a folder and its subfolders, in a new Google Sheet.
// 1. Paste the folder's ID between the quotes. (Open the folder in Drive: the ID is the long string after folders/ in the address.)
// 2. Choose "inventory" and press Run. The first run asks to see your Drive and make a Sheet. Read it, then allow.
// 3. Open the Execution log for the link to the Sheet.

const FOLDER_ID = "PASTE_THE_FOLDER_ID_HERE";

function inventory() {
  const root = DriveApp.getFolderById(FOLDER_ID);
  const rows = [["Folder", "Title", "Type", "Link", "Last changed"]];
  walk(root, root.getName(), rows);
  const sheet = SpreadsheetApp.create("Inventory: " + root.getName());
  sheet.getActiveSheet().getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  sheet.getActiveSheet().setFrozenRows(1);
  Logger.log((rows.length - 1) + " files listed. Open the inventory: " + sheet.getUrl());
}

// Every file in this folder, then every folder inside it, and so on
function walk(folder, path, rows) {
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    rows.push([path, file.getName(), kind(file.getMimeType()), file.getUrl(), file.getLastUpdated()]);
  }
  const folders = folder.getFolders();
  while (folders.hasNext()) {
    const sub = folders.next();
    walk(sub, path + " / " + sub.getName(), rows);
  }
}

// A file's type in plain words
function kind(mime) {
  const names = {
    "application/vnd.google-apps.document": "Doc",
    "application/vnd.google-apps.spreadsheet": "Sheet",
    "application/vnd.google-apps.presentation": "Slides",
    "application/vnd.google-apps.form": "Form",
    "application/vnd.google-apps.folder": "Folder",
    "application/pdf": "PDF"
  };
  return names[mime] || mime.replace(/^.*\//, "");
}
