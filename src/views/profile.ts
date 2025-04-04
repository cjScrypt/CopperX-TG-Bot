import { I18nContext } from "@grammyjs/i18n";
import { renderFile } from "ejs";
import { resolve } from "path";
import { CopperXUser } from "../interfaces";
import { Markup } from "telegraf";
import { LocaleUtils } from "../utils";
import { BOT } from "../constants";

export class ProfileView {
    static getProfileHtml(i18n: I18nContext, profile: CopperXUser) {
        const name = [ profile.firstName, profile.lastName ]
            .filter(Boolean)
            .join(" ");
        return renderFile(resolve(__dirname, "./templates", "profile.ejs"), {
            LocaleUtils,
            i18n,
            name,
            profile
        });
    }

    static getProfileKeyboard(i18n: I18nContext) {
        return Markup.inlineKeyboard([
            [
                Markup.button.callback(
                    LocaleUtils.getActionText(i18n, BOT.ACTION.WALLET_MANAGEMENT),
                    BOT.ACTION.WALLET_MANAGEMENT
                ),
                Markup.button.callback(
                    LocaleUtils.getActionText(i18n, BOT.ACTION.PROFILE_BACK),
                    BOT.ACTION.PROFILE_BACK
                )
            ],
            // [
            //     Markup.button.callback(
            //         LocaleUtils.getActionText(i18n, BOT.ACTION.EXIT),
            //         BOT.ACTION.EXIT
            //     )
            // ]

        ]);
    }
}