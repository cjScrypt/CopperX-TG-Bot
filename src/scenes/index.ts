import { Scenes } from "telegraf";
import { loginScene } from "./login";
import { ExtendedContext } from "../interfaces";
import { profileScene } from "./profile";

export const mainStage = new Scenes.Stage<ExtendedContext>(
    [loginScene, profileScene]
);