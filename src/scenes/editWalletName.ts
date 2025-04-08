import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { BOT } from "../constants";
import { ExtendedContext } from "../interfaces";
import { CommonController, WalletController } from "../controllers";
import { GlobalMiddleware } from "../middlewares";
import { RegexUtils } from "../utils";

export const editWalletName = new Scenes.BaseScene<ExtendedContext>(
    BOT.SCENE.EDIT_WALLET_NAME
);

editWalletName.enter(WalletController.promptEditWalletName);

editWalletName.on(message('text'), WalletController.editWalletName);

editWalletName.action(
    RegexUtils.matchAction(BOT.ACTION.EDIT_WALLET_NAME_BACK),
    GlobalMiddleware.cancelScene,
    CommonController.reenterScene(BOT.ACTION.EDIT_WALLET_NAME_BACK),
    WalletController.showWalletDetails
);