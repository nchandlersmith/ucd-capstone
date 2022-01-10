export interface CreateAccountRequest {
  accountType: string,
  initialDeposit: number
}

export interface CreateAccountResponse {
  accountId: string,
  accountType: string,
  balance: number
}