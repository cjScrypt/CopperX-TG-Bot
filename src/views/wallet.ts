import { I18nContext } from "@grammyjs/i18n";
import { renderFile } from "ejs";
import { resolve } from "path";
import { Markup } from "telegraf";
import { WalletDto } from "../interfaces";
import { ConstantUtils, LocaleUtils, StringUtils } from "../utils";
import { BOT } from "../constants";

export class WalletView {
    static getDefaultWalletHtml(i18n: I18nContext, wallet: WalletDto) {
        return renderFile(resolve(__dirname, "./templates/defaultWallet.ejs"), {
            i18n,
            name: wallet.name,
            network: wallet.network,
            walletAddress: wallet.walletAddress,
            LocaleUtils
        });
    }

    static getWalletOverviewKeyboard(
        i18n: I18nContext,
        defaultWallet: WalletDto,
        wallets: WalletDto[]
    ) {
        const keyboard = []
        const firstRow = [
            Markup.button.callback(
                LocaleUtils.getActionText(i18n, BOT.ACTION.EXPAND_DEFAULT_WALLET),
                ConstantUtils.getActionData(
                    BOT.ACTION.EXPAND_WALLET,
                    defaultWallet.id
                ),
            )
        ];
        keyboard.push(firstRow);

        let middleRow = [];
        for (const wallet of wallets) {
            if (wallet.id == defaultWallet.id) {
                continue;
            }
            const name = wallet.name || wallet.network;

            middleRow.push(
                Markup.button.callback(
                    name,
                    ConstantUtils.getActionData(BOT.ACTION.EXPAND_WALLET, wallet.id)
                )
            );
            if (middleRow.length == 2) {
                keyboard.push(middleRow);
                middleRow = [];
            }
        }
        keyboard.push(middleRow);

        return Markup.inlineKeyboard(keyboard);
    }
}