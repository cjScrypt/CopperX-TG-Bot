import { BOT } from "../constants";

export class RegexUtils {
    static isCommand(text: string) {
        return text.startsWith("/");
    }

    static matchExpandWallet() {
        return new RegExp(`^${BOT.ACTION.EXPAND_WALLET}_.+$`);
    }

    static matchActionCode(action: string) {
        return new RegExp(`^${action}_(.+)$`);
    }
}