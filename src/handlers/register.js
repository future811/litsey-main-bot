import { appendToSheets } from "../lib/append-to-sheets.js";

export async function registerHandler(ctx, next) {
  if (!ctx.session.waitingForName && !ctx.session.waitingForPhone) {
    return await next();
  }
  const userQuestion = ctx.message.text?.trim();

  await ctx.replyWithChatAction("typing");

  if (ctx.session.waitingForName) {
    const nameRegex = /^[а-яА-ЯёЁa-zA-Z\-]+\s+[а-яА-ЯёЁa-zA-Z\-]+$/;

    if (!nameRegex.test(userQuestion) || userQuestion.length < 5) {
      return await ctx.reply(
        "Некорректный формат ФИО.\n" +
          "Пожалуйста, введите ваши реальные фамилию и имя:",
      );
    }
    ctx.session.userName = userQuestion;
    ctx.session.waitingForName = false;
    ctx.session.waitingForPhone = true;
    return await ctx.reply("Отлично! Теперь введите ваш номер телефона");
  }

  if (ctx.session.waitingForPhone) {
    const cleanPhone = userQuestion.replace(/[\s\-\(\)]/g, "");
    let normalizedPhone = cleanPhone;

    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "+996" + normalizedPhone.slice(1);
    } else if (normalizedPhone.startsWith("996")) {
      normalizedPhone = "+" + normalizedPhone;
    } else if (/^\d{9}$/.test(normalizedPhone)) {
      normalizedPhone = "+996" + normalizedPhone;
    }

    ctx.session.userPhone = userQuestion;
    const phoneRegex = /^\+996\d{9}$/;

    if (!phoneRegex.test(normalizedPhone)) {
      return await ctx.reply(
        "Некорректный номер телефона.\n" +
          "Пожалуйста, введите номер в формате: +996123456789",
      );
    }
    ctx.session.userPhone = cleanPhone;
    ctx.session.waitingForPhone = false;
    const bookingData = {
      fullName: ctx.session.userName,
      phone: ctx.session.userPhone,
      username: ctx.from?.username ? `@${ctx.from.username}` : "Не указан",
      telegramId: ctx.from?.id.toString(),
    };

    await appendToSheets(bookingData);

    return await ctx.reply(
      `Заявка успешно принята и сохранена!\n\n` +
        `<b>ФИО</b>: ${bookingData.fullName}\n` +
        `<b>Телефон:</b> ${bookingData.phone}`,
      { parse_mode: "HTML" },
    );
  }
}
