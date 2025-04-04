import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { ExtendedContext } from "../interfaces";
import { GlobalMiddleware } from "../middlewares";

export const profileScene = new Scenes.BaseScene<ExtendedContext>(
    BOT.SCENE.PROFILE
);

profileScene.use(GlobalMiddleware.authTokenInSession);