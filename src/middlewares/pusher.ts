import { setupBot } from "../bot";
import { ExtendedContext } from "../interfaces";
import { pusherClient } from "../services";
import { TelegramUtils } from "../utils";

export class PusherMiddleware {
    static subscribeToEvent(ctx: ExtendedContext, next: () => Promise<void>) {
        // @todo Ensure Pusher event is subscribed occasionally
        const organizationId = ctx.session.copperX.user?.organizationId;
        if (!organizationId) {
            return next();
        }

        const channelName = `private-org-${organizationId}`
        const channel = pusherClient.subscribe(channelName);

        channel.bind("pusher:subscription_succeeded", () => {
            console.log('Successfully subscribed to private channel');
        });

        channel.bind("pusher:subscription_error", (error: any) => {
            console.error('Subscription error:', error);
        });

        const chatId = TelegramUtils.getChatId(ctx);
        if (!chatId) {
            return next();
        }

        const bot = setupBot();

        pusherClient.bind('deposit', (data: any) => {
            const message = `💰 *New Deposit Received*`;
            bot.telegram.sendMessage(chatId, message);
        });
    }
}