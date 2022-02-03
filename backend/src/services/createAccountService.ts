import {CreateCapstoneAccountDao, CreateCapstoneAccountRequest} from "../models/createAccountModels";
import {ModelValidationError} from "../exceptions/exceptions";
import {v4 as uuidv4} from 'uuid'
import { DateTime } from 'luxon'
import {insertCapstoneAccount} from "../persistence/dbClient";

export function createCapstoneAccount(request: CreateCapstoneAccountRequest, userId: string | null | undefined) {
  if (!userId) {
    throw new Error('User authorized. Userid not recognized. Request denied.')
  }
  validateCreateCapstoneAccountRequest(request)

  insertCapstoneAccount(buildCreateCapstoneAccountItem(request, userId))
}

function validateCreateCapstoneAccountRequest(request: CreateCapstoneAccountRequest) {
  if(!request.accountType || request.accountType === ' ') {
    throw new ModelValidationError('Invalid account type on account create request. Request denied.')
  }
  if(!request.initialDeposit) {
    throw new ModelValidationError('Invalid initial deposit on account create request. Request denied.')
  }
}

function buildCreateCapstoneAccountItem(request: CreateCapstoneAccountRequest, userId: string): CreateCapstoneAccountDao {
  return {
    userId,
    accountId: uuidv4(),
    accountType: request.accountType,
    balance: request.initialDeposit,
    createdOn: `${DateTime.now().toISO()}`
  }
}
