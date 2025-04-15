import { CopperXAuthRepository } from "../database/repository";
import { CopperXService } from "./copperX.service";
import prisma from "../database/prisma/client";

interface LoginEmailOtpResponseDto {
    email: string,
    sid: string
}

interface AuthenticateResponseDto {
    accessToken: string,
    expireAt: Date,
    user: {
        firstName: string,
        lastName: string,
        email: string,
        status: "pending" | "active" | "suspended"
        walletAddress: string,
        organizationId: string
    }
}

export class AuthService {
    private copperXService: CopperXService;
    private copperXAuthRepository: CopperXAuthRepository;

    constructor() {
        this.copperXService = new CopperXService();
        this.copperXAuthRepository = new CopperXAuthRepository(prisma);
    }

    async requestOtp(email: string) {
        const endpoint = "api/auth/email-otp/request";
        const body = { email }
        const response = await this.copperXService.makePostRequest(
            endpoint,
            body
        ) as LoginEmailOtpResponseDto | undefined;

        return response;
    }

    async verifyOtp(
        otp: string,
        loginDto: LoginEmailOtpResponseDto,
        chatId: number
    ) {
        const endpoint = "api/auth/email-otp/authenticate";
        const body = {
            ...loginDto,
            otp
        }
        const response = await this.copperXService.makePostRequest(
            endpoint,
            body
        ) as AuthenticateResponseDto | undefined;
        if (response) {
            await this.copperXAuthRepository.saveAuthToken(
                chatId,
                response.accessToken,
                response.expireAt
            );
        }

        return response;
    }

    async logout(token: string) {
        const endpoint = "api/auth/logout";
        const response = await this.copperXService.makePostRequest(
            endpoint,
            {},
            token
        );
        if (response.message != "Ok") {
            return false;
        }

        return true;
    }
}