import { ExtendedContext } from "../interfaces";
import { LoginView } from "../views";

export class LoginController {
    static async showLoginActionPrompt(ctx: ExtendedContext, next: () => Promise<void>) {
        ctx.wizard.state.userOtp = {};
        // @todo Cache message ID and delete on next query
        ctx.reply(LoginView.getLoginActionPrompt(ctx.i18n));

        return ctx.wizard.next();
    }
}