import { CopperXService } from "./copperX.service";
import { WalletRepository } from "../database/repository";
import prisma from "../database/prisma/client";
import { WalletBalanceDto, WalletDto } from "../interfaces";
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
            throw new Error(`No default wallet found`);
        }

        const wallet = await this.walletRepository.findWallet(response.id);

        const data = {
            id: response.id,
            name: wallet?.name || "No name set",
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

    async getWalletsBalances(token: string) {
        const endpoint = "api/wallets/balances";
        const response = await this.copperXService.makeGetRequest(
            endpoint,
            token
        ) as WalletBalanceDto[];
        if (!response) {
            throw new Error(`Failed to fetch wallets`);
        }
        const walletIds = response.map((wallet) => wallet.walletId);
        const walletNames = await this.walletRepository.getWalletNamesById(walletIds);

        return response.map((value) => ({
            walletId: value.walletId,
            network: ConstantUtils.getNetworkName(value.network),
            balances: value.balances,
            name: walletNames.get(value.walletId) || "No name set",
        }));
    }

    async getWalletById(walletId: string, token: string) {
        const wallets = await this.getWalletsBalances(token);

        return wallets.find((wallet) => {
            return wallet.walletId == walletId;
        })
    }
}

