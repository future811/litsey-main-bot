import { config } from "../const/config.js";
import { askOpenAI } from "../services/ai.js";

export async function adminHandler(ctx) {
  ctx.session.waitingForAI = false;
  await ctx.replyWithChatAction("typing");

  try {
    const systemQuery = "номер телефона и контакты администрации";

    const botAnswer = await askOpenAI(systemQuery, ctx.faqContext);

    if (botAnswer === "NOT_FOUND") {
      await ctx.reply("Номер администрации:", config.adminNumber);
    } else {
      ctx.replyMD(botAnswer);
    }
  } catch (error) {
    console.error("Error fetching admin contact from FAQ:", error);
    await ctx.reply("Не удалось получить контакты. Попробуйте позже.");
  }
}
