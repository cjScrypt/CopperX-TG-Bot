import { PrismaClient } from "@prisma/client";

export class CopperXAuthRepository {
    private readonly prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async getAuthTokenByChatId(chatId: number) {
        const copperXAuth = await this.prisma.copperXAuth.findUnique({
            where: { chatId },
            select: { token: true, expiresAt: true, isValid: true }
        });

        return copperXAuth;
    }

    async saveAuthToken(chatId: number, token: string, expiresAt: Date): Promise<void> {
        await this.prisma.copperXAuth.upsert({
            where: { chatId },
            update: {
                token,
                expiresAt
            },
            create: {
                chatId,
                token,
                expiresAt
            }
        });
    }
}