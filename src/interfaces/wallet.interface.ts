export interface WalletDto {
    id: string,
    network: string,
    walletAddress: string,
    name: string
}

export interface BalanceDto {
    symbol: string,
    balance: string,
    decimals: number,
    address: string
}

export interface WalletBalanceDto {
    walletId: string,
    network: string,
    balances: BalanceDto[]
}