import { I18nContext } from "@grammyjs/i18n";
import { renderFile } from "ejs";
import { resolve } from "path";
import { WalletDto } from "../interfaces";

export class WalletView {
    static getDefaultWalletHtml(i18n: I18nContext, wallet: WalletDto) {
        return renderFile(resolve(__dirname, "./templates/defaultWallet.ejs"), {
            i18n,
            wallet
        });
    }
}