import { CODE } from "../constants";
import prisma from "../database/prisma/client";
import { CopperXRepository } from "../database/repository";
import { CopperXUser } from "../interfaces";


export class CopperXService {
    repository: CopperXRepository;
    private readonly baseApiUrl: string = "https://income-api.copperx.io";
  
    constructor() {
        this.repository = new CopperXRepository(prisma);
    }

    private async makeGetRequest(endpoint: string, token: string) {
        const url = `${this.baseApiUrl}/${endpoint}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error(CODE.ERROR.AUTH_EXPIRED);
            }
            throw new Error(`API responsed with status: ${response.status}`);
        }

        return response.json();
    }

    async getAuthTokenByChatId(chatId: number) {
        const copperXAuth = await this.repository.getAuthTokenByChatId(chatId);
        if (!copperXAuth || new Date() >= copperXAuth.expiresAt) {
            return null;
        }

        return copperXAuth;
    }

    async fetchUserProfile(token: string) {
        try {
            const userProfile = await this.makeGetRequest("api/auth/me", token) as CopperXUser;

            return {
                id: userProfile.id,
                firstName: userProfile.firstName,
                lastName: userProfile.lastName,
                email: userProfile.email,
                status: userProfile.status,
                walletAddress: userProfile.walletAddress
            }
        } catch (error) {
            console.error(`Error fetching user profile: ${error}`);
            if (error instanceof Error && error.message === CODE.ERROR.AUTH_EXPIRED) {
                // @todo Do Something else
                return null;
            }

            return null;
        }
        
    }
}