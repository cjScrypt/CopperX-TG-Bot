import { PrismaClient } from "@prisma/client";

export class CopperXRepository {
    private readonly prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
}