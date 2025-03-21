import { renderFile } from "ejs";
import { resolve } from "path";

export class HelpView {
    static getHelpHtml(name: string) {
        return renderFile(resolve(__dirname, "templates/onboarding.ejs"), {
            name
        });
    }
}