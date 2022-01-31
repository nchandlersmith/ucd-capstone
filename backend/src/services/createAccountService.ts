import {CreateCapstoneAccountDao, CreateCapstoneAccountRequest} from "../models/createAccountModels";
import {ModelValidationError} from "../exceptions/exceptions";
import {v4 as uuidv4} from 'uuid'

export function validateCreateCapstoneAccountRequest(request: CreateCapstoneAccountRequest) {
  if(!request.accountType || request.accountType === ' ') {
    throw new ModelValidationError('Invalid account type on account create request. Request denied.')
  }
  if(!request.initialDeposit) {
    throw new ModelValidationError('Invalid initial deposit on account create request. Request denied.')
  }
}

export function buildCreateCapstoneAccountItem(request: CreateCapstoneAccountRequest, userId: string): CreateCapstoneAccountDao {
  const date = new Date()
  return {
    userId,
    accountId: uuidv4(),
    accountType: request.accountType,
    balance: request.initialDeposit,
    createdOn: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }
}
