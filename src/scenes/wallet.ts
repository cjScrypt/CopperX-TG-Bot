import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { BOT } from "../constants";
import { CommonController, WalletController } from "../controllers";
import { ExtendedContext } from "../interfaces";
import { WalletMiddleware } from "../middlewares";
import { RegexUtils } from "../utils";

export const walletScene = new Scenes.BaseScene<ExtendedContext>(
    BOT.SCENE.WALLET_MANAGEMENT
);

walletScene.enter(WalletController.showWalletOverview);

walletScene.use(WalletMiddleware.expectWalletName);

walletScene.action(
    RegexUtils.matchExpandWallet(),
    WalletController.showWalletDetails
);

walletScene.action(
    RegexUtils.matchAction(BOT.ACTION.EDIT_WALLET_NAME),
    WalletController.promptEditWalletName
);

walletScene.on(message('text'), WalletController.editWalletName);

walletScene.action(
    RegexUtils.matchAction(BOT.ACTION.CANCEL),
    WalletController.showWalletDetails
);