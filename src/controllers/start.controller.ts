import { ExtendedContext } from "../interfaces";
import { UserService } from "../services";
import { TelegramUtils } from "../utils";
import { StartView } from "../views";

export class StartController {
    static async showStart(ctx: ExtendedContext, next: () => Promise<void>) {
        let tgUser = TelegramUtils.getUserFromContext(ctx);
        if (!tgUser) {
            return;
        }
        const { user, created } = await (new UserService()).getOrRegisterUser({
            telegramId: tgUser.id,
            username: tgUser.username,
            firstName: tgUser.first_name,
            lastName: tgUser.last_name
        });
        const name = [ user.firstName, user.lastName ].filter(Boolean).join(" ");
        let htmlContent: string;

        if (created) { // First time user
            htmlContent = await StartView.getOnboardingStartHtml(name);
        } else {
            htmlContent = "Hello World";
        }

        ctx.reply(htmlContent, {
            parse_mode: "HTML",
            link_preview_options: {
                is_disabled: true
            }
        });
    }
}