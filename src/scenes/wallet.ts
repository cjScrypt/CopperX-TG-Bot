import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { CommonController, WalletController } from "../controllers";
import { ExtendedContext } from "../interfaces";
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