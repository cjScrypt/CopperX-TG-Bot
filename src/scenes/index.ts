import { Scenes } from "telegraf";
import { loginScene } from "./login";
import { ExtendedContext } from "../interfaces";
import { profileScene } from "./profile";
import { transferScene } from "./transfer";
import { walletScene } from "./wallet";
import { emailTransfer } from "./emailTransfer";

export const mainStage = new Scenes.Stage<ExtendedContext>(
    [loginScene, profileScene, walletScene, transferScene, emailTransfer]
);