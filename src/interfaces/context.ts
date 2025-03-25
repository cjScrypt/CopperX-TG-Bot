import { I18nContext } from "@grammyjs/i18n";
import { User } from "@prisma/client";
import { Context, Scenes } from "telegraf";
import { CopperXSession } from "./copperx.interface";

interface WizardSessionData extends Scenes.WizardSessionData {
    userOtp: {
        email: string;
        sid: string;
    }

}

export interface ExtendedContext extends Context  {
    copperXSession: CopperXSession,
    i18n: I18nContext,
    scene: Scenes.SceneContextScene<ExtendedContext, WizardSessionData>,
    user: User,
    wizard: Scenes.WizardContextWizard<ExtendedContext> & {
        state: WizardSessionData
    }
}