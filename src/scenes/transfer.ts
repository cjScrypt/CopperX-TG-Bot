import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { TransferController } from "../controllers";
import { ExtendedContext } from "../interfaces";

export const transferScene = new Scenes.BaseScene<ExtendedContext>(
    BOT.SCENE.TRANSFER
);

transferScene.enter(TransferController.showTransferMenu);