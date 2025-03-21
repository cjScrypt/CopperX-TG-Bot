import { ExtendedContext } from "../interfaces";
import { StartView } from "../views";

export class StartController {
    static async showStart(ctx: ExtendedContext, next: () => Promise<void>) {
        const user = ctx.user;
        const name = [ user.firstName, user.lastName ].filter(Boolean).join(" ");

        const htmlContent = await StartView.getOnboardingStartHtml(name);

        ctx.reply(htmlContent, {
            parse_mode: "HTML",
            link_preview_options: {
                is_disabled: true
            }
        });
    }
}