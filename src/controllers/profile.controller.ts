import { ExtendedContext } from "../interfaces";
import { ProfileView } from "../views";

export class ProfileController {
    static async showProfile(ctx: ExtendedContext, next: () => Promise<void>) {
        const profile = ctx.session.copperX.user;
        if (!profile) {
            throw new Error(`Profile not found for user ${ctx.from?.id}`);
        }

        const htmlContent = await ProfileView.getProfileHtml(ctx.i18n, profile);
        const msg = await ctx.reply(htmlContent, {
            parse_mode: "HTML",
            reply_markup: ProfileView.getProfileKeyboard(ctx.i18n).reply_markup
        });
        ctx.session.botMessageId = msg.message_id;

        return next();
    }
}