import { WalletRepository } from "../database/repository";
import prisma from "../database/prisma/client";
import { WalletDto } from "../interfaces";
import { ConstantUtils } from "../utils";
import { CopperXService } from "./copperX.service"

export class WalletService {
    private readonly copperXService: CopperXService;
    private readonly walletRepository: WalletRepository;

    constructor() {
        this.copperXService = new CopperXService();
        this.walletRepository = new WalletRepository(prisma);
    }

    async getDefaultWallet(token: string, profileId: string) {
        const endpoint = "api/wallets/default";
        const response = await this.copperXService.makeGetRequest(
            endpoint,
            token
        ) as WalletDto | undefined; 
        if (!response) {
            return null;
        }

        const wallet = await this.walletRepository.getOrCreateWallet(
            profileId,
            response
        );

        const data = {
            id: response.id,
            name: wallet.name,
            network: ConstantUtils.getNetworkName(response.network),
            walletAddress: response.walletAddress
        }

        return data;
    }
}