import { I18nContext } from "@grammyjs/i18n";
import { BOT } from "../constants";

export class LocaleUtils {
    static getActionText(i18n: I18nContext, action: string, value?: string) {
        return this.getActionCommonText(i18n, "action", action, value);
    }

    private static getActionCommonText(i18n: I18nContext, group: string, action: string, value?: string) {
        const actionKey = `${group}.${action}`;
        const variables = {
            
        }
        return i18n.t(actionKey, variables);
    }
}