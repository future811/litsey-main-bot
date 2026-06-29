import { keyboard } from "../keyboard.js";

export async function unknownMessageHandler(ctx) {
  await ctx.reply(
    "Пожалуйста, выберите действие на клавиатуре ниже:", 
    { reply_markup: keyboard }
  );
}