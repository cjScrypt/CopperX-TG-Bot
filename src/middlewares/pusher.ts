import Pusher from "pusher-js";
import {
    PUSHER_KEY,
    PUSHER_CLUSTER
} from "../config";
import { setupBot } from "../bot";
import { ExtendedContext } from "../interfaces";
import { authorizerFn } from "../services";
import { SessionUtils, TelegramUtils } from "../utils";

export class PusherMiddleware {
    static subscribeToEvent(ctx: ExtendedContext, next: () => Promise<void>) {
        if (ctx.session.subscribedToPusher === true) {
            return next();
        }

        const pusherClient = new Pusher(PUSHER_KEY, {
            cluster: PUSHER_CLUSTER,
            authorizer: authorizerFn(ctx.session.copperX.token)
        });
        const bot = setupBot();

        const organizationId = ctx.session.copperX.user?.organizationId;
        if (!organizationId) {
            return next();
        }

        const channelName = `private-org-${organizationId}`
        const channel = pusherClient.subscribe(channelName);

        channel.bind("pusher:subscription_succeeded", async () => {
            ctx.session.subscribedToPusher = true;
            await SessionUtils.saveSession(ctx);

            console.log('Successfully subscribed to private channel');
        });

        channel.bind("pusher:subscription_error", (error: any) => {
            console.error('Subscription error:', error);
        });

        const chatId = TelegramUtils.getChatId(ctx);
        if (!chatId) {
            return next();
        }

        pusherClient.bind('deposit', (data: any) => {
            const message = `💰 *New Deposit Received*`;
            bot.telegram.sendMessage(chatId, message);
        });

        return next();
    }
}