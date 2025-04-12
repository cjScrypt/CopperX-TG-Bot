import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { EmailTransferController } from "../controllers";
import { ExtendedContext } from "../interfaces";
import { GlobalMiddleware } from "../middlewares";
import { RegexUtils } from "../utils";

export const emailTransfer = new Scenes.WizardScene<ExtendedContext>(
    BOT.SCENE.TRANSFER_EMAIL,
    EmailTransferController.promptEmail,
    EmailTransferController.promptPayeeId,
    EmailTransferController.promptPurposeCode,
    EmailTransferController.handleAmountInput
);

emailTransfer.action(
    RegexUtils.matchAction(BOT.ACTION.TRANSFER_EMAIL),
    EmailTransferController.handlePurposeCode,
    EmailTransferController.promptCurrencyCode
);

emailTransfer.action(
    RegexUtils.matchAction(BOT.ACTION.TRANSFER_CURRENCY),
    EmailTransferController.handleCurrencyInput,
    EmailTransferController.promptAmount
);

emailTransfer.action(
    BOT.ACTION.CONFIRM_EMAIL_TRANSFER,
    EmailTransferController.sendEmailTransfer,
    GlobalMiddleware.cancelScene
);

emailTransfer.action(
    BOT.ACTION.CANCEL,
    GlobalMiddleware.cancelScene
);