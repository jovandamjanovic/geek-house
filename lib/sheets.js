import { google } from 'googleapis';
export async function getPoints() {
  try {
    const target = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      target
    );

    const sheets = google.sheets({ version: 'v4', auth: jwt });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'A:J'
    });

    const rows = response.data.values;
    if (rows.length) {
      return rows.map((row) => ({
        ime: row[0],
        poeniPoKolu: row.slice(1,9),
        poeni: row[9]
      }));
    }
  } catch (err) {
    console.log(err);
  }
  return [];
}