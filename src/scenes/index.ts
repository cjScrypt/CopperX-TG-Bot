import { Scenes } from "telegraf";
import { loginScene } from "./login";
import { ExtendedContext } from "../interfaces";
import { GlobalMiddleware } from "../middlewares";

export const mainStage = new Scenes.Stage<ExtendedContext>(
    [loginScene]
);

mainStage.use(GlobalMiddleware.cleanupUserMessage);