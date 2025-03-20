import { PrismaClient } from "@prisma/client";

export default new PrismaClient(
    {
        datasources: { // @note Use this to evaluate value at runtime
            db: { url: process.env.DB_URL }
        }
    }
);