import { ExtendedContext } from "../interfaces";
import { StartView } from "../views";

export class StartController {
    static async showStart(
        ctx: ExtendedContext,
        next: () => Promise<void>
    ) {
        const keyboard = ctx.copperXSession
            ? StartView.getLoggedInKeyboard(ctx.i18n)
            : StartView.getLoggedOutKeyboard(ctx.i18n);

        const user = ctx.user;
        const name = [ user.firstName, user.lastName ].filter(Boolean).join(" ");
        const htmlContent = StartView.getStartHtml(ctx.i18n, name, ctx.copperXSession);

        ctx.reply(htmlContent, {
            parse_mode: "HTML",
            reply_markup: keyboard.reply_markup,
            link_preview_options: {
                is_disabled: true
            }
        });

        return next();
    }
}