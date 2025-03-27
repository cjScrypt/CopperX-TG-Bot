export class RegexUtils {
    static isCommand(text: string) {
        return text.startsWith("/");
    }
}