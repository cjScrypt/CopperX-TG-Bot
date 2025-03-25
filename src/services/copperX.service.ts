import { CODE } from "../constants";
import prisma from "../database/prisma/client";
import { CopperXAuthRepository } from "../database/repository";
import { CopperXUser } from "../interfaces";


export class CopperXService {
    repository: CopperXAuthRepository;
    private readonly baseApiUrl: string = "https://income-api.copperx.io";
  
    constructor() {
        this.repository = new CopperXAuthRepository(prisma);
    }

    private async makeRequest(
        method: string,
        endpoint: string,
        authToken: string,
        body?: object
    ) {
        try {
            const url = `${this.baseApiUrl}/${endpoint}`;
            const response = await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error(CODE.ERROR.AUTH_EXPIRED);
                }
                throw new Error(`API responsed with status: ${response.status}`);
            }

            return response;
        } catch(error) {
            return null;
        }
    }

    async makeGetRequest(
        endpoint: string,
        authToken: string
    ): Promise<any | undefined> {
        const response = await this.makeRequest("GET", endpoint, authToken);

        return response?.json();
    }

    async makePostRequest(
        endpoint: string,
        authToken: string,
        body: object
    ): Promise<any | undefined> {
        const response = await this.makeRequest(
            "POST",
            endpoint,
            authToken,
            body
        );

        return response?.json();
    }

    async getAuthTokenByChatId(chatId: number) {
        const copperXAuth = await this.repository.getAuthTokenByChatId(chatId);
        if (!copperXAuth || !copperXAuth.isValid) {
            return null;
        }

        if (new Date() >= copperXAuth.expiresAt) {
            return null;
        }

        return copperXAuth;
    }

    async fetchUserProfile(token: string) {
        try {
            const userProfile = await this.makeGetRequest("api/auth/me", token) as CopperXUser;

            return {
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