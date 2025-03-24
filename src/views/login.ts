import { I18nContext } from "@grammyjs/i18n";
import { LocaleUtils } from "../utils";

export class LoginView {
    static getLoginActionPrompt(i18n: I18nContext) {
        return LocaleUtils.getActionReplyText(i18n, "login.actionPrompt");
    }
}