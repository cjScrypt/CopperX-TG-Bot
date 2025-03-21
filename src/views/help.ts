import { I18nContext } from "@grammyjs/i18n";
import { renderFile } from "ejs";
import { resolve } from "path";

export class HelpView {
    static getHelpHtml(name: string, i18n: I18nContext) {
        return renderFile(resolve(__dirname, "templates/help.ejs"), {
            name,
            i18n
        });
    }
}