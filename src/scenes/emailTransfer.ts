import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { ExtendedContext } from "../interfaces";

export const emailTransfer = new Scenes.WizardScene<ExtendedContext>(
    BOT.SCENE.TRANSFER_EMAIL
);

