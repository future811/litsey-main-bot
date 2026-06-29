import { askOpenAI } from "../services/ai.js";

export async function askedQuestionsHandler(ctx) {
  ctx.session.waitingForAI = false;
  await ctx.replyWithChatAction("typing");

  try {
    const systemQuery = "часто задаваемые вопросы";

    const botAnswer = await askOpenAI(systemQuery, ctx.faqContext);

    if (botAnswer === "NOT_FOUND") {
      await ctx.reply("Ответ временно недоступен");
    } else {
      ctx.replyMD(botAnswer);
    }
  } catch (error) {
    console.error("Error fetching admin contact from FAQ:", error);
    await ctx.reply(
      "Не удалось найти часто задаваемые вопросы. Попробуйте позже.",
    );
  }
}
