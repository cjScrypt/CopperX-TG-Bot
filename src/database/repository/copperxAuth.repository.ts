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
}