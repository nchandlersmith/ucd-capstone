export interface CapstoneAccount {
  userId: string,
  accountId: string,
  accountType: string,
  balance: number,
  createdOn: string
}

export interface GetCapstoneAccountsResponse {
  accounts: CapstoneAccount[]
}
