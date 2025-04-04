import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { ProfileController } from "../controllers";
import { ExtendedContext } from "../interfaces";
import { GlobalMiddleware } from "../middlewares";

export const profileScene = new Scenes.BaseScene<ExtendedContext>(
    BOT.SCENE.PROFILE
);

profileScene.enter(ProfileController.showProfile);

profileScene.use(GlobalMiddleware.authTokenInSession);