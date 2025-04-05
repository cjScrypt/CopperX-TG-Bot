import { WalletDto } from "../interfaces";
import { CopperXService } from "./copperX.service"

export class WalletService {
    private readonly copperXService: CopperXService;

    constructor() {
        this.copperXService = new CopperXService();
    }

    async getDefaultWallet(token: string) {
        const endpoint = "api/wallets/default";
        const response = await this.copperXService.makeGetRequest(
            endpoint,
            token
        ) as WalletDto | undefined; 
        if (!response) {
            return null;
        }

        const data = {
            id: response.id,
            network: response.network,
            walletAddress: response.walletAddress
        }

        return data;
    }
}