import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { ExtendedContext } from "../interfaces";

export const walletScene = new Scenes.BaseScene<ExtendedContext>(
    BOT.SCENE.WALLET_MANAGEMENT
);