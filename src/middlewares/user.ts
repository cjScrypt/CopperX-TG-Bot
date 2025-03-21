import { ExtendedContext } from "../interfaces";
import { UserService } from "../services";
import { TelegramUtils } from "../utils";

export class UserMiddleware {
    static async addUserToContext(
        ctx: ExtendedContext,
        next: () => Promise<void>
    ) {
        let tgUser = TelegramUtils.getUserFromContext(ctx);
        if (!tgUser) {
            return;
        }
        let user = await (new UserService()).findUserByTgId(tgUser.id);
        if (!user) {
            user = await (new UserService()).createUser({
                telegramId: tgUser.id,
                username: tgUser.username,
                firstName: tgUser.first_name,
                lastName: tgUser.last_name
            });
        }
        ctx.user = user;

        await next();
    }
}