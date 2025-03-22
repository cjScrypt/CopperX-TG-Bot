export interface CopperXSession {
    token: string,
    user: CopperXUser
}

interface CopperXUser {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    status: string,
    walletAddress: string
}