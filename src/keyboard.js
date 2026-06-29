import { Keyboard } from "grammy";
import { Hears } from "./const/hears.js";

export const keyboard = new Keyboard()
  .row()
  .text(Hears.AI_HELPER)
  .text(Hears.ADMIN)
  .row()
  .text(Hears.ASKED_QUESTIONS)
  .text(Hears.REGISTER)
  .resized()
  .persistent();
