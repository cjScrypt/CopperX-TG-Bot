import { I18nContext } from "@grammyjs/i18n";
import { User } from "@prisma/client";
import { Context, Scenes } from "telegraf";
import { CopperXSession } from "./copperx.interface";

export interface ExtendedContext extends Context  {
    copperXSession?: CopperXSession,
    i18n: I18nContext,
    scene: Scenes.SceneContextScene<ExtendedContext>,
    user: User
}