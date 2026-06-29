import fs from "fs";
import { WasmPdfDocument } from "pdf-oxide-wasm/nodejs";
import { config } from "../const/config.js";

export async function FAQLoad() {
  let combinedText = "";

  for (const filePath of config.pdf) {
    try {
      const dataBuffer = fs.readFileSync(filePath);

      const pdfDoc = new WasmPdfDocument(new Uint8Array(dataBuffer));

      const text = pdfDoc.extractAllText();

      const field = pdfDoc.getFormFields();

      combinedText += `\n--- СЕКЦИЯ ИЗ ФАЙЛА ${filePath} ---\n` + text;
      console.log(`Sucess: ${filePath}`);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      throw error;
    }
  }

  return combinedText;
}
