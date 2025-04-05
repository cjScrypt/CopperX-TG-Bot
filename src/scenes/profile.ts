import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { ProfileController, StartController } from "../controllers";
import { ExtendedContext } from "../interfaces";
import { GlobalMiddleware } from "../middlewares";

export const profileScene = new Scenes.BaseScene<ExtendedContext>(
    BOT.SCENE.PROFILE
);

profileScene.enter(ProfileController.showProfile);

profileScene.use(
    GlobalMiddleware.authTokenInSession,
    GlobalMiddleware.addCopperXProfileToContext,
    GlobalMiddleware.cleanupMessages
);

profileScene.action(
    BOT.ACTION.PROFILE_BACK,
    StartController.showStart,
    Scenes.Stage.leave<ExtendedContext>()
);

profileScene.leave(GlobalMiddleware.cleanupMessages);