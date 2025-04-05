import { ExtendedContext } from "../interfaces";
import { WalletService } from "../services";
import { WalletView } from "../views";

export class WalletController {
    static async showWalletOverview(
        ctx: ExtendedContext,
        next: () => Promise<void>
    ) {
        const wallet = await (new WalletService()).getDefaultWallet(
            ctx.session.copperX.token
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