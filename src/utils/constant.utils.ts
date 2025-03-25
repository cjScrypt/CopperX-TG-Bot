import { CODE } from "../constants";

export class ConstantUtils {
    static getActionCode(action: string) {
        return CODE.ACTION[action.toUpperCase()];
    }
}