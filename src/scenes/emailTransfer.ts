import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { EmailTransferController } from "../controllers";
import { ExtendedContext } from "../interfaces";
import { GlobalMiddleware } from "../middlewares";

export const emailTransfer = new Scenes.WizardScene<ExtendedContext>(
    BOT.SCENE.TRANSFER_EMAIL,
    EmailTransferController.promptEmail,
    EmailTransferController.promptPayeeId,
    EmailTransferController.promptPurposeCode,
    EmailTransferController.promptCurrencyCode,
    EmailTransferController.promptAmount,
    EmailTransferController.promptConfirmTransaction
);

emailTransfer.action(
    BOT.ACTION.CONFIRM_TRANSFER,
    EmailTransferController.sendEmailTransfer,
    GlobalMiddleware.cancelScene
);

emailTransfer.action(
    BOT.ACTION.CANCEL,
    GlobalMiddleware.cancelScene
);