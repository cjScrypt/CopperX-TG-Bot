import { isEmail } from "class-validator";
import { ExtendedContext } from "../interfaces";
import { AuthService } from "../services";
import { LocaleUtils, SessionUtils, TelegramUtils } from "../utils";
import { LoginView } from "../views";

export class LoginController {
    static async showLoginActionPrompt(ctx: ExtendedContext, next: () => Promise<void>) {
        const msg = await ctx.reply(
            LoginView.getLoginActionPrompt(ctx.i18n),
            {
                reply_markup: LoginView.getCancelKeyboard(ctx.i18n).reply_markup
            }
        );
        SessionUtils.saveHistory(ctx.session, msg.message_id);

        return ctx.wizard.next();
    }

    static async requestOtp(ctx: ExtendedContext, next: () => Promise<void>) {
        const email = TelegramUtils.getMessageText(ctx) || ctx.wizard.state.userOtp?.email;
        if (!email || !isEmail(email)) {
            const msg = await ctx.reply(
                LocaleUtils.getActionReplyText(ctx.i18n, "login.invalidEmail"),
                {
                    reply_markup: LoginView.getCancelKeyboard(ctx.i18n).reply_markup
                }
            );
            SessionUtils.saveHistory(ctx.session, msg.message_id);

            return;
        }

        const authService = new AuthService();
        const response = await authService.requestOtp(email);
        if (!response) {
            const msg = await ctx.reply(
                LocaleUtils.getActionReplyText(ctx.i18n, "login.failedRequestOtp"),
                {
                    reply_markup: LoginView.getCancelKeyboard(ctx.i18n).reply_markup
                }
            );
            SessionUtils.saveHistory(ctx.session, msg.message_id);

            return;
        }

        ctx.wizard.state.userOtp = {
            email,
            sid: response.sid
        }
        const msg = await ctx.reply(
            LocaleUtils.getActionReplyText(
                ctx.i18n,
                "login.otpSent",
                email
            ),
            {
                reply_markup: LoginView.getCancelKeyboard(ctx.i18n).reply_markup
            }
        );
        SessionUtils.saveHistory(ctx.session, msg.message_id);

        return ctx.wizard.next();
    }

    static async verifyOtp(ctx: ExtendedContext, next: () => Promise<void>) {
        const chatId = TelegramUtils.getChatId(ctx);
        if (!chatId) {
            return;
        }

        const otp = TelegramUtils.getMessageText(ctx);
        if (!otp) {
            const msg = await ctx.reply(
                LocaleUtils.getActionReplyText(ctx.i18n, "login.reenterOtp"),
                {
                    reply_markup: LoginView.getCancelKeyboard(ctx.i18n).reply_markup
                }
            );
            SessionUtils.saveHistory(ctx.session, msg.message_id);
            return;
        }

        const authService = new AuthService();
        const response = await authService.verifyOtp(otp, ctx.wizard.state.userOtp, chatId);
        if (!response) {
            const msg = await ctx.reply(
                LocaleUtils.getActionReplyText(ctx.i18n, "login.invalidOtp" ),
                {
                    reply_markup: LoginView.getInvalidOtpKeyboard(ctx.i18n).reply_markup
                }
            );
            SessionUtils.saveHistory(ctx.session, msg.message_id);

            return;
        }
        const msg = await ctx.reply(
            LocaleUtils.getActionReplyText(ctx.i18n, "login.success")
        );
        SessionUtils.saveHistory(ctx.session, msg.message_id);

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

        return ctx.scene.leave();
    }

    static async resendOtp(ctx: ExtendedContext, next: () => Promise<void>) {
        ctx.wizard.cursor = 1;
        ctx.answerCbQuery();

        return LoginController.requestOtp(ctx, next);
    }

    static async changeEmail(ctx: ExtendedContext, next: () => Promise<void>) {
        ctx.wizard.cursor = 0;
        ctx.answerCbQuery();

        return LoginController.showLoginActionPrompt(ctx, next);
    }
}