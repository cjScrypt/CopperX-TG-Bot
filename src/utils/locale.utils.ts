import { I18nContext } from "@grammyjs/i18n";
import { ConstantUtils } from "./constant.utils";

export class LocaleUtils {
    static getActionText(i18n: I18nContext, action: string) {
        return this.getActionCommonText(i18n, "action", action);
    }

    static getActionReplyText(i18n: I18nContext, action: string, value?: string) {
        return this.getActionCommonText(i18n, "reply", action, value);
    }

    static getWelcomeText(i18n: I18nContext, text: string, value?: string) {
        return this.getActionCommonText(i18n, "welcome", text, value);
    }

    private static getActionCommonText(
        i18n: I18nContext,
        group: string,
        action: string,
        value?: string
    ) {
        const actionKey = `${group}.${action}`;
        const actionCode = ConstantUtils.getActionCode(action);
        const variables = {
            code: actionCode,
            value: value || ""
        }

        return i18n.t(actionKey, variables);
    }
}