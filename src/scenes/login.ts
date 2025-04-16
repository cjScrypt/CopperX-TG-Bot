import { Scenes } from "telegraf";
import { BOT } from "../constants";
import { ExtendedContext } from "../interfaces";
import { LoginController } from "../controllers";
import { GlobalMiddleware } from "../middlewares";

export const loginScene = new Scenes.WizardScene<ExtendedContext>(
    BOT.SCENE.LOGIN,
    LoginController.showLoginActionPrompt,
    LoginController.requestOtp,
    LoginController.verifyOtp
);

loginScene.use(
    GlobalMiddleware.preventCommandsInScene(`/${BOT.ACTION.LOGIN}`),
    GlobalMiddleware.deleteUserMessage
    // GlobalMiddleware.filterForeignCallbacks(BOT.ACTION.LOGIN),
    // GlobalMiddleware.clearPreviousStage
);

loginScene.action(
    BOT.ACTION.CANCEL,
    GlobalMiddleware.cancelScene,
    GlobalMiddleware.cleanupMessages
);

loginScene.action(BOT.ACTION.RESEND_OTP, LoginController.resendOtp);
loginScene.action(BOT.ACTION.CHANGE_EMAIL, LoginController.changeEmail);

loginScene.leave(GlobalMiddleware.unsetDeleteMessage);