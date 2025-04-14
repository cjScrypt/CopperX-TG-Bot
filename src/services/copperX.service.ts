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
        authToken?: string,
        body?: object
    ) {
        try {
            const url = `${this.baseApiUrl}/${endpoint}`;
            const headers: HeadersInit = { "Content-Type": "application/json" }
            if (authToken) {
                headers["Authorization"] = `Bearer ${authToken}`;
            }

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(body)
            });
            const responseBody = await response.json();
            if (!response.ok) {
                throw new Error(responseBody.error);
            }

            return responseBody;
        } catch(error: any) {
            if (error.message == CODE.ERROR.UNAUTHORIZED) { // Missing authentication token
                throw error; // This will be handled by the error middleware
            }
            console.error(`Error making request to CopperX: ${error}`);
            return null;
        }
    }

    async makeGetRequest(
        endpoint: string,
        authToken?: string
    ): Promise<any | undefined> {
        const response = await this.makeRequest("GET", endpoint, authToken);

        return response;
    }

    async makePostRequest(
        endpoint: string,
        body: object,
        authToken?: string,
    ): Promise<any | undefined> {
        const response = await this.makeRequest(
            "POST",
            endpoint,
            authToken,
            body
        );

        return response;
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
        const userProfile = await this.makeGetRequest("api/auth/me", token) as CopperXUser | null;
        if (!userProfile) {
            return null;
        }

        return {
            id: userProfile.id,
            organizationId: userProfile.organizationId,
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            email: userProfile.email,
            status: userProfile.status,
            walletAddress: userProfile.walletAddress
        }
    }
}