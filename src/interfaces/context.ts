import { I18nContext } from "@grammyjs/i18n";
import { User } from "@prisma/client";
import { Context } from "telegraf";

export interface ExtendedContext extends Context  {
    i18n: I18nContext,
    user: User
}