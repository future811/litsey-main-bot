import { keyboard } from "../keyboard.js";

export async function startHandler(ctx) {
  await ctx.reply(
    `Добро пожаловать
        
        Я - оператор-помощник лицея
        /start - начать работу
        `,
    { reply_markup: keyboard },
  );
}
