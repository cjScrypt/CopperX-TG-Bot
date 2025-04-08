import { PrismaClient } from "@prisma/client";
import { WalletDto } from "../../interfaces";

export class WalletRepository {
    private readonly prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findWallet(walletId: string) {
        let walletObj = await this.prisma.wallet.findFirst({
            where: { id: walletId }
        });

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

    async upsert(walletId: string, name: string) {
        return this.prisma.wallet.upsert({
            where: { id: walletId },
            update: {
                name
            },
            create: {
                id: walletId,
                name: name
            }
        });
    }
}