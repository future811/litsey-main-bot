import express from "express";
import { initBot } from "./bot.js";
import { ExtractNumber } from "./lib/extract-number.js";
import { FAQLoad } from "./lib/faq-load.js";
async function startProject() {
  try {
    console.log("Start project...");

    const faqContext = await FAQLoad();

    const number = ExtractNumber(faqContext);

    initBot(faqContext, number);
  } catch (error) {
    console.error("Error: bot not started", error);
    process.exit(1);
  }
}
startProject();

const app = express();
const port = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("Bot working!");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`HTTP server is running on the port ${port}`);
});
