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

        const wallet = await (new WalletService()).getDefaultWallet(
            ctx.session.copperX.token,
            profileId
        );
        if (!wallet) {
            console.error(`No default wallet found`);
            return;
        }
        
        const htmlContent = await WalletView.getDefaultWalletHtml(ctx.i18n, wallet);
        await ctx.reply(htmlContent);

        return next();
    }
}