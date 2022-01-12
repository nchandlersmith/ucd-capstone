export interface CreateAccountRequest {
  accountType: string,
  initialDeposit: number
}

export interface CreateAccountResponse {
  accountId: string,
  accountType: string,
  balance: number
}

export interface CreateAccountDao {
  accountId: string,
  accountType: string,
  initialDeposit: number,
  createdOn: string
}