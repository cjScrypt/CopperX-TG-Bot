import { resolve } from "path";
import { I18n } from "@grammyjs/i18n";


import { LOCALE } from "../constants";

export const i18n = new I18n({
    directory: resolve(__dirname, "../", "locales"),
    defaultLanguage: LOCALE.LANGUAGE.EN,
});