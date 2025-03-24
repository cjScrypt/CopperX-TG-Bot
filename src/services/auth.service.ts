import { CopperXService } from "./copperX.service";
import { RedisService } from "./redis.service";

interface LoginEmailOtpResponseDto {
    email: string,
    sid: string
}

export class AuthService {
    private copperXService: CopperXService;

    constructor() {
        this.copperXService = new CopperXService();
    }

    async requestOtp(authToken: string, email: string) {
        const endpoint = "/api/auth/email-otp/request";
        const body = { email }
        const response = await this.copperXService.makePostRequest(
            endpoint,
            authToken,
            body
        ) as LoginEmailOtpResponseDto;

        return response;
    }
}