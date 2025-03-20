import { renderFile } from "ejs";
import { resolve } from "path";

export class StartView {
    static getOnboardingStartHtml(name: string) {
        return renderFile(resolve(__dirname, "templates/onboarding.ejs"), {
            name
        });
    }
}