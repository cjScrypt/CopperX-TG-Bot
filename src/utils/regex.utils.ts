import { BOT } from "../constants";

export class RegexUtils {
    static isCommand(text: string) {
        return text.startsWith("/");
    }

    static matchExpandWallet() {
        return new RegExp(`^${BOT.ACTION.EXPAND_WALLET}_*$`);
    }
}