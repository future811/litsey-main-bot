import OpenAI from "openai";
import { config } from "../const/config.js";

const openai = new OpenAI({
  apiKey: config.deepseekKey,
  baseURL: "https://api.deepseek.com",
});

export async function askOpenAI(userQuestion, faqContext) {
  const contextText = faqContext || "Контекст временно недоступен.";
  const responce = await openai.chat.completions.create({
    model: config.aiModel,
    messages: [
      {
        role: "system",
        content: `Ты — оператор-помощник в лицее. Твоя задача — отвечать на вопросы строго на основе предоставленного текста FAQ.
        Отвечай кратко и четко, 2-4 предложении. Не упоминай в ответе слово "FAQ".
        Отвечай сразу и не говори пользователю откуда взял данные.
                Внимательно изучай текст FAQ. Если пользователь запрашивает контакты, телефон, адрес или номер администрации ты должен скинуть их из FAQ
                Если в тексте FAQ действительно НЕТ ответа на заданный вопрос (информация полностью отсутствует), ты ДОЛЖЕН дать номера администрации, только при том случае если не можешь найти номер администрации используй NOT_FOUND. Не придумывай ничего от себя.
                Отвечай по стилю текста Markdown:
                - **жирный текст** для важных моментов (номера телефонов, адреса, сроки)
- списки через "- " на отдельной строке для перечислений.
- не трогай логику приложения, только отвечаешь таким форматом.
                `,
      },
      {
        role: "user",
        content: `Контекст (FAQ лицея):\n${faqContext}\n\nВопрос пользователя: ${userQuestion}`,
      },
    ],
    temperature: 0.1,
  });

  return responce.choices[0].message.content.trim();
}
