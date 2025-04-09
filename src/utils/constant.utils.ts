import { BOT, CODE } from "../constants";

export class ConstantUtils {
    static getActionCode(action: string) {
        return CODE.ACTION[action.toUpperCase()];
    }

    static getNetworkName(network: string) {
        const networkCode = CODE.NETWORK[network];
        if (!networkCode) {
            return network;
        }

        return networkCode;
    }

    static getActionData(action: string, code?: string) {
        const actionCode = BOT.ACTION[action.toUpperCase()];
        if (!actionCode) {
            return action;
        }
        if (code) {
            const separator = "_-_";
            return `${actionCode}${separator}${code}`;
        }

        return actionCode;
    }
}