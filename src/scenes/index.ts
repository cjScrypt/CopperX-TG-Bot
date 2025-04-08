import { Scenes } from "telegraf";
import { loginScene } from "./login";
import { ExtendedContext } from "../interfaces";
import { profileScene } from "./profile";
import { walletScene } from "./wallet";
import { editWalletName } from "./editWalletName";

export const mainStage = new Scenes.Stage<ExtendedContext>(
    [loginScene, profileScene, editWalletName, walletScene]
);