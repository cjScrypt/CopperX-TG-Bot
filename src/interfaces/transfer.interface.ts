export interface EmailTransferDto {
    email?: string,
    payeeId?: string,
    purposeCode?: string
    currency?: string,
    amount?: string
}

export interface TransactionDto {
    amount: string,
    status: string,
    invoiceNumber: string,
    paymentUrl: string,
    invoiceUrl: string
}