import { Scenes } from "telegraf";
import { ExtendedContext } from "../interfaces";
import { loginScene } from "./login";

export const mainStage = new Scenes.Stage<ExtendedContext>(
    [loginScene]
);