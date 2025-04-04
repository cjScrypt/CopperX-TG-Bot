import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { ExtendedContext } from "../interfaces";

export const profileScene = new Scenes.BaseScene<ExtendedContext>(
    BOT.SCENE.PROFILE
);