import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { BOT } from "../constants";
import { CommonController, WalletController } from "../controllers";
import { ExtendedContext } from "../interfaces";
import { GlobalMiddleware } from "../middlewares";
import { GlobalMiddleware } from "../middlewares";
import { RegexUtils } from "../utils";

export const walletScene = new Scenes.BaseScene<ExtendedContext>(
    BOT.SCENE.WALLET_MANAGEMENT
);

walletScene.enter(WalletController.showWalletOverview);

walletScene.action(
    RegexUtils.matchExpandWallet(),
    WalletController.showWalletDetails
);

walletScene.action(
    BOT.ACTION.EDIT_WALLET_NAME,
    CommonController.enterScene(BOT.SCENE.EDIT_WALLET_NAME)
);

walletScene.action(
    BOT.ACTION.EDIT_WALLET_NAME,
    WalletController.promptEditWalletName
);

walletScene.on(message('text'), WalletController.editWalletName);

walletScene.action(
    RegexUtils.matchAction(BOT.ACTION.CANCEL),
    WalletController.showWalletDetails
)