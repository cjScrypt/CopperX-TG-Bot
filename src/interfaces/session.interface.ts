import { Scenes } from "telegraf";
import { CopperXSession } from "./copperx.interface";

export interface WizardSessionData extends Scenes.WizardSessionData {
    userOtp: {
        email: string;
        sid: string;
    }

}

export interface SessionData {
    copperX: CopperXSession;
    userLastMessageId: number;
}

export interface SceneSession extends Scenes.SceneSession<WizardSessionData>, SessionData {}