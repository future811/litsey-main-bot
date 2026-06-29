import { google } from "googleapis";

export async function appendToSheets(data) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const currentDate = new Date().toLocaleString("kg-KG", {
      timeZone: "Asia/Bishkek",
    });

    const sheetName = process.env.GOOGLE_SHEET_NAME;

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheetName}!A:E`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            data.fullName,
            data.phone,
            data.username,
            data.telegramId,
            currentDate,
          ],
        ],
      },
    });
    console.log("Данные успешно записаны в Google Sheets!");
  } catch (error) {
    console.error("Ошибка записи в Google Sheets:", error);
  }
}
