import { I18nContext } from "@grammyjs/i18n";
import { renderFile } from "ejs";
import { resolve } from "path";
import { CopperXUser } from "../interfaces";

export class ProfileView {
    static getProfileHtml(i18n: I18nContext, profile: CopperXUser) {
        const name = [ profile.firstName, profile.lastName ]
            .filter(Boolean)
            .join(" ");
        return renderFile(resolve(__dirname, "./templates", "profile.ejs"), {
            i18n,
            name,
            profile
        });
    }
}