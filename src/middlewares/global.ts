import { i18n } from "../commons/locale";

export class GlobalMiddleware {
    static addI18nToContext = i18n.middleware();
}