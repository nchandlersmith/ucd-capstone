export interface CreateCapstoneAccountRequest {
  accountType: string,
  initialDeposit: number
}

export interface CreateCapstoneAccountResponse {
  accountId: string,
  accountType: string,
  balance: number,
  createdOn: string
}

export interface CreateCapstoneAccountDao {
  userId: string,
  accountId: string,
  accountType: string,
  balance: number,
  createdOn: string
}
