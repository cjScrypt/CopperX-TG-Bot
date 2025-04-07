import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { WalletController } from "../controllers";
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