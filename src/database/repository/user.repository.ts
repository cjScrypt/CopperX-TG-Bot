import { PrismaClient } from "@prisma/client";
import { CreateUserDto } from "../../interfaces";

export class UserRepository {
    private readonly prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
    async create(fields: CreateUserDto) {
        const user = await this.prisma.user.create({
            data: {
                telegramId: fields.telegramId,
                username: fields.username,
                firstName: fields.firstName,
                lastName: fields.lastName
            }
        });

        return user;
    }

    async findOne(filter: any) {
        const user = await this.prisma.user.findFirst({
            where: filter
        });

        return user;
    }
}