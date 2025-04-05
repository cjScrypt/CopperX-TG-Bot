import { CODE } from "../constants";

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
}