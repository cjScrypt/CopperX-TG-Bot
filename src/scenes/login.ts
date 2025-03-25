import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { ExtendedContext } from "../interfaces";
import { LoginController } from "../controllers";

export const loginScene = new Scenes.WizardScene<ExtendedContext>(
    BOT.SCENE.LOGIN,
    LoginController.showLoginActionPrompt,
    LoginController.requestOtp,
    LoginController.verifyOtp
);
