import { UserRepository } from "../database/repository";
import prisma from "../database/prisma/client";
import { CreateUserDto } from "../interfaces";

export class UserService {
    repository: UserRepository;

    constructor() {
        this.repository = new UserRepository(prisma);
    }

    async createUser(fields: CreateUserDto) {
        let user = await this.findUserByTgId(fields.telegramId);
        if (!user) {
            user = await this.repository.create(fields);
        }

        return user;
    }

    async findUserByTgId(id: number) {
        return this.repository.findOne({ telegramId: id });
    }
}