import { ExtendedContext } from "../interfaces";
import { HelpView } from "../views";

export class HelpController {
    static async showHelp(ctx: ExtendedContext, next: () => Promise<void>) {
        const user = ctx.user;
        const name = [ user.firstName, user.lastName ].filter(Boolean).join(" ");

        const htmlContent = await HelpView.getHelpHtml(name);

        ctx.reply(htmlContent, {
            parse_mode: "HTML",
            link_preview_options: {
                is_disabled: true
            }
        });
    }
}