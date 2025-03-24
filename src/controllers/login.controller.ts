import { ExtendedContext } from "../interfaces";
import { LoginView } from "../views";

export class LoginController {
    static async showLoginActionPrompt(ctx: ExtendedContext, next: () => Promise<void>) {
        const htmlContent = LoginView.getLoginActionPrompt(ctx.i18n);
        ctx.reply(htmlContent); // @todo Cache message ID and delete on next query

        return ctx.wizard.next();
    }
}