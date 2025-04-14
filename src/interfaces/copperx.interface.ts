export interface CopperXSession {
    token: string,
    user?: CopperXUser
}

export interface CopperXUser {
    id?: string,
    organizationId: string,
    firstName: string,
    lastName: string,
    email: string,
    status: string,
    walletAddress: string
}