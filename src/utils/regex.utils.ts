import { BOT } from "../constants";

export class RegexUtils {
    static isCommand(text: string) {
        return text.startsWith("/");
    }

    static matchAction(action: string) {
        const separator = "_-_";
        return new RegExp(`^${action}${separator}.+$`);
    }

    static matchExpandWallet() {
        return new RegExp(`^${BOT.ACTION.EXPAND_WALLET}_.+$`);
    }

    static matchActionCode(action?: string) {
        const separator = "_-_";
        if (!action) {
            return new RegExp(`^.+${separator}(.+)$`);
        }
        return new RegExp(`^${action}${separator}(.+)$`);
    }
}