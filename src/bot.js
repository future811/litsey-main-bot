import { config } from "./const/config.js";
import { botSessionData } from "./lib/bot-session-data.js";
import { Bot, session } from "grammy";
import { startHandler } from "./handlers/start.js";
import { Hears } from "./const/hears.js";
import { aiAnswerHandler } from "./handlers/ai-answer.js";
import { adminHandler } from "./handlers/admin.js";
import { askedQuestionsHandler } from "./handlers/asked-questions.js";
import { unknownMessageHandler } from "./handlers/unknown-message.js";
import { registerHandler } from "./handlers/register.js";
import { markdown } from "./lib/markdown.js";

export function initBot(faqContext, number) {
  const bot = new Bot(config.telegramToken);
  
  bot.use(
    session({
      initial: botSessionData,
    }),
  );
  
  bot.use(markdown());

  bot.use(async (ctx, next) => {
    ctx.faqContext = faqContext;
    ctx.adminNumber = number;
    await next();
  });

  bot.command("start", startHandler);

  bot.hears(Hears.AI_HELPER, (ctx) => {
    ctx.reply("Задайте ваш вопрос");
    ctx.session.waitingForAI = true;
    ctx.session.waitingForName = false;
    ctx.session.waitingForPhone = false;
  });

  bot.hears(Hears.ADMIN, adminHandler);
  bot.hears(Hears.ASKED_QUESTIONS, askedQuestionsHandler);
  bot.hears(Hears.REGISTER, (ctx) => {
    ctx.session.waitingForName = true;
    ctx.session.waitingForPhone = false;
    ctx.session.waitingForAI = false;
    ctx.reply("Введите ваше ФИО:");
  });

  bot.on("message:text", registerHandler);
  bot.on("message:text", aiAnswerHandler);
  bot.on("message", unknownMessageHandler);
  bot.start();
  console.log("Bot Started");
}
