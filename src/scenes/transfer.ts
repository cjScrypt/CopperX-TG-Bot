import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { CommonController, TransferController } from "../controllers";
import { ExtendedContext } from "../interfaces";

export const transferScene = new Scenes.BaseScene<ExtendedContext>(
    BOT.SCENE.TRANSFER
);

transferScene.enter(TransferController.showTransferMenu);

transferScene.action(
    BOT.ACTION.TRANSFER_EMAIL,
    CommonController.enterScene(BOT.SCENE.TRANSFER_EMAIL)
);