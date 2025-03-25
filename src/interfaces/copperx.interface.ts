export interface CopperXSession {
    token: string,
    user?: CopperXUser
}

export interface CopperXUser {
    firstName: string,
    lastName: string,
    email: string,
    status: string,
    walletAddress: string
}