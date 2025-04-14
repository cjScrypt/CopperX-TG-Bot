export interface EmailTransferDto {
    email?: string,
    payeeId?: string,
    purposeCode?: string
    currency?: string,
    decimal?: number
    amount?: string
}

export interface WalletTransferDto {
    address?: string,
    purposeCode?: string,
    currency?: string,
    decimal?: number,
    amount?: string
}

export interface TransactionDto {
    amount: string,
    status: string,
    invoiceNumber: string,
    paymentUrl: string,
    invoiceUrl: string
}