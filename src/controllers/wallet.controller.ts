import { BOT } from "../constants";
import { ExtendedContext } from "../interfaces";
import { WalletService } from "../services";
import { LocaleUtils, RegexUtils, TelegramUtils } from "../utils";
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

        await ctx.reply(htmlContent, {
            parse_mode: "HTML",
            reply_markup: keyboard
        });

        return next();
    }

    static async showWalletDetails(
        ctx: ExtendedContext,
        next: () => Promise<void>
    ) {
        let data = "";
        if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
            data = ctx.callbackQuery.data;
        }
        const match = data.match(RegexUtils.matchActionCode(BOT.ACTION.EXPAND_WALLET));
        if (!match) {
            return;
        }

        const walletId = match[1];
        const token = ctx.session.copperX.token;
        const wallet = await (new WalletService()).getWalletById(walletId, token);
        if (!wallet) {
            await ctx.reply("Wallet not found");
            return;
        }
        const htmlContent = await WalletView.getWalletDetailsView(ctx.i18n, wallet);
        const keyboard = WalletView.getWalletDetailsKeyboard(ctx.i18n).reply_markup;

        ctx.reply(htmlContent, {
            parse_mode: "HTML",
            reply_markup: keyboard
        });
    }

    static async promptEditWalletName(ctx: ExtendedContext, next: () => Promise<void>) {
        let data = "";
        if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
            data = ctx.callbackQuery.data;
        }
        const match = data.match(RegexUtils.matchActionCode(BOT.ACTION.EDIT_WALLET_NAME));
        if (!match) {
            return;
        }

        const walletId = match[1];
        ctx.session.editWalletId = walletId;

        await ctx.reply(
            LocaleUtils.getWalletText(ctx.i18n, "editName.prompt")
        );

        return next();
    }
}