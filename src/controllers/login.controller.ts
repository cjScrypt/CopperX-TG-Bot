import { isEmail } from "class-validator";
import { ExtendedContext } from "../interfaces";
import { AuthService } from "../services";
import { LocaleUtils, TelegramUtils } from "../utils";
import { LoginView } from "../views";

export class LoginController {
    static async showLoginActionPrompt(ctx: ExtendedContext, next: () => Promise<void>) {
        // @todo Cache message ID and delete on next query
        ctx.reply(LoginView.getLoginActionPrompt(ctx.i18n));

        return ctx.wizard.next();
    }

    static async requestOtp(ctx: ExtendedContext, next: () => Promise<void>) {
        const email = TelegramUtils.getMessageText(ctx);
        if (!email || !isEmail(email)) {
            ctx.reply(LocaleUtils.getActionReplyText(
                ctx.i18n,
                "login.invalidEmail"
            ));

            return;
        }

        const authService = new AuthService();
        const response = await authService.requestOtp(email);
        if (!response) {
            ctx.reply(LocaleUtils.getActionReplyText(
                ctx.i18n,
                "login.failedRequestOtp"
            ));
            return ctx.wizard.back();
        }

        ctx.wizard.state.userOtp = {
            email,
            sid: response.sid
        }
        ctx.reply(LocaleUtils.getActionReplyText(ctx.i18n, "login.otpSent"));

        return ctx.wizard.next();
    }

    static async verifyOtp(ctx: ExtendedContext, next: () => Promise<void>) {
        const chatId = TelegramUtils.getChatId(ctx);
        if (!chatId) {
            return;
        }

        const otp = TelegramUtils.getMessageText(ctx);
        if (!otp) {
            ctx.reply(LocaleUtils.getActionReplyText(ctx.i18n, "login.reenterOtp"));
        }

        const authService = new AuthService();
        const response = await authService.verifyOtp(otp, ctx.wizard.state.userOtp, chatId);
        if (!response) {
            ctx.reply(LocaleUtils.getActionReplyText(
                ctx.i18n,
                "login.invalidOtp"
            ));

            return;
        }

        ctx.session.copperX = {
            token: response.accessToken,
            user: {
                firstName: response.user.firstName,
                lastName: response.user.lastName,
                email: response.user.email,
                status: response.user.status,
                walletAddress: response.user.walletAddress
            }
        }

        return next();
    }
}