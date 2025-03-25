import { I18nContext } from "@grammyjs/i18n";
import { User } from "@prisma/client";
import { Context, Scenes } from "telegraf";
import { CopperXSession } from "./copperx.interface";
import { SceneSession, WizardSessionData } from "./session.interface";

export interface ExtendedContext extends Context  {
    session: SceneSession,
    copperXSession: CopperXSession,
    i18n: I18nContext,
    scene: Scenes.SceneContextScene<ExtendedContext, WizardSessionData>,
    user: User,
    wizard: Scenes.WizardContextWizard<ExtendedContext> & {
        state: WizardSessionData
    }
}