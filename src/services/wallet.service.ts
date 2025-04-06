import { CopperXService } from "./copperX.service";
import { WalletRepository } from "../database/repository";
import prisma from "../database/prisma/client";
import { WalletDto } from "../interfaces";
import { ConstantUtils } from "../utils";

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

    async getWallets(token: string) {
        const endpoint = "api/wallets";
        const response = await this.copperXService.makeGetRequest(
            endpoint,
            token
        ) as WalletDto[];

        const walletIds = response.map((wallet) => wallet.id);
        const walletNames = await this.walletRepository.getWalletNamesById(walletIds);

        return response.map((wallet) => ({
            id: wallet.id,
            network: ConstantUtils.getNetworkName(wallet.network),
            walletAddress: wallet.walletAddress,
            name: walletNames.get(wallet.id) || ""
        }));
    }
}