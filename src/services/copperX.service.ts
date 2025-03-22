import prisma from "../database/prisma/client";
import { CopperXRepository } from "../database/repository";


export class CopperXService {
    repository: CopperXRepository;
  
    constructor() {
        this.repository = new CopperXRepository(prisma);
    }
}