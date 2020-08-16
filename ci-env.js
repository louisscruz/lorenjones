const {
  GOOGLE_DRIVE_FOLDER_ID,
  GOOGLE_SERVICE_ACCOUNT_CREDENTIALS,
  GOOGLE_SPREADSHEET_ID,
} = process.env

module.exports = {
  googleDriveFolderId: GOOGLE_DRIVE_FOLDER_ID,
  googleServiceAccountCredentials: JSON.parse(
    GOOGLE_SERVICE_ACCOUNT_CREDENTIALS.trim().replace(/\n/g, "\\n")
  ),
  googleSpreadsheetId: GOOGLE_SPREADSHEET_ID,
}
