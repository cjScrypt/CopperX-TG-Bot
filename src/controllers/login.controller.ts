import { ExtendedContext } from "../interfaces";
import { AuthService } from "../services";
import { LocaleUtils, TelegramUtils } from "../utils";
import { LoginView } from "../views";

export class LoginController {
    static async showLoginActionPrompt(ctx: ExtendedContext, next: () => Promise<void>) {
        ctx.wizard.state.userOtp = {};
        // @todo Cache message ID and delete on next query
        ctx.reply(LoginView.getLoginActionPrompt(ctx.i18n));

        return ctx.wizard.next();
    }

    static async requestOtp(ctx: ExtendedContext, next: () => Promise<void>) {
        const email = TelegramUtils.getMessageText(ctx);
        if (!email) {
            ctx.reply(LocaleUtils.getActionReplyText(
                ctx.i18n,
                "login.invalidEmail"
            ));

            return;
        }

        ctx.wizard.state.userOtp.email = email;

        const authService = new AuthService();
        const response = await authService.requestOtp(ctx.copperXSession.token, email);
        ctx.wizard.state.userOtp = {
            email,
            sid: response.sid
        }
    }
}