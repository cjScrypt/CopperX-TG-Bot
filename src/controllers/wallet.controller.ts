import { ExtendedContext } from "../interfaces";
import { WalletService } from "../services";
import { WalletView } from "../views";

export class WalletController {
    static async showWalletOverview(
        ctx: ExtendedContext,
        next: () => Promise<void>
    ) {
        const profileId = ctx.session.copperX.user?.id;
        if (!profileId) {
            console.error(`User Profile ID not found`);
            return;
        }

        const token = ctx.session.copperX.token;
        const walletService = new WalletService();

        const defaultWallet = await walletService.getDefaultWallet(
            token,
            profileId
        );
        const wallets = await walletService.getWallets(token);

        const htmlContent = await WalletView.getDefaultWalletHtml(
            ctx.i18n,
            defaultWallet
        );
        const keyboard = WalletView.getWalletOverviewKeyboard(
            ctx.i18n,
            defaultWallet,
            wallets
        ).reply_markup;

        await ctx.reply(htmlContent, { reply_markup: keyboard });

        return next();
    }
}