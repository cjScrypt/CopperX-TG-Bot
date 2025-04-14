import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { WalletTransferController } from "../controllers";
import { ExtendedContext } from "../interfaces";
import { GlobalMiddleware } from "../middlewares";

export const walletTransfer = new Scenes.WizardScene<ExtendedContext>(
    BOT.SCENE.TRANSFER_WALLET,
    WalletTransferController.promptAddress,
    WalletTransferController.promptPurposeCode,
    WalletTransferController.promptCurrencyCode,
    WalletTransferController.promptAmount,
    WalletTransferController.promptConfirmTransaction
);

walletTransfer.action(
    BOT.ACTION.CONFIRM_TRANSFER,
    WalletTransferController.sendWalletTransfer,
    GlobalMiddleware.cancelScene
);

walletTransfer.action(
    BOT.ACTION.CANCEL,
    GlobalMiddleware.cancelScene
);