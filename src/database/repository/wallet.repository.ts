import { PrismaClient } from "@prisma/client";
import { WalletDto } from "../../interfaces";

export class WalletRepository {
    private readonly prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async getOrCreateWallet(profileId: string, wallet: WalletDto) {
        let walletObj = await this.prisma.wallet.findFirst({
            where: { profileId }
        });
        if (!walletObj) {
            walletObj = await this.prisma.wallet.create({
                data: {
                    id: wallet.id,
                    network: wallet.network,
                    walletAddress: wallet.walletAddress,
                    profileId
                }
            });
        }

        return walletObj;
    }

    async getWalletNamesById(walletIds: string[]) {
        const wallets = await this.prisma.wallet.findMany({
            where: {
                id: { in: walletIds }
            },
            select: {
                id: true,
                name: true
            }
        });

        const walletMap = new Map<string, string>();
        wallets.forEach((wallet) => {
            walletMap.set(wallet.id, wallet.name);
        });

        return walletMap;
    }
}