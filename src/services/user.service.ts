import { UserRepository } from "../database/repository";
import prisma from "../database/prisma/client";
import { CreateUserDto } from "../interfaces";

export class UserService {
    repository: UserRepository;

    constructor() {
        this.repository = new UserRepository(prisma);
    }

    async getOrRegisterUser(fields: CreateUserDto) {
        let user = await this.repository.findOne({
            telegramId: fields.telegramId
        });
        let created = false;
        if (!user) {
            user = await this.repository.create(fields);
            created = true;
        }

        return { user, created }
    }
}