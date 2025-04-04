import { Scenes } from "telegraf";
import { CopperXSession } from "./copperx.interface";

export interface WizardSessionData extends Scenes.WizardSessionData {
    userOtp: {
        email: string;
        sid: string;
    }
    history?: {
        botMessageId: number
    }
}

export interface SessionData {
    copperX: CopperXSession;
    botMessageId: number;
    userMessageId: number;
}

export interface SceneSession extends Scenes.SceneSession<WizardSessionData>, SessionData {}