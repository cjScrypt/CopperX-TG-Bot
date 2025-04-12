import { CopperXService } from "./copperX.service";
import { EmailTransferDto } from "../interfaces";

export class TransferService {
    private readonly copperXService: CopperXService;

    constructor() {
        this.copperXService = new CopperXService();
    }

    async sendEmailTransfer(body: EmailTransferDto, token: string) {
        const endpoint = "api/transfers/send";

        const response = await this.copperXService.makePostRequest(endpoint, body, token);

        return {
            amount: response.amount,
            status: response.status,
            invoiceNumber: response.invoiceNumber,
            paymentUrl: response.paymentUrl,
            invoiceUrl: response.invoiceUrl
        };
    }
}