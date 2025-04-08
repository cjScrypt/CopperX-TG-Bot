import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { ExtendedContext } from "../interfaces";
import { WalletController } from "../controllers";

export const editWalletName = new Scenes.BaseScene<ExtendedContext>(
    BOT.SCENE.EDIT_WALLET_NAME
);

editWalletName.enter(WalletController.promptEditWalletName);