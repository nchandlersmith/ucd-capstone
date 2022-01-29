import {CreateCapstoneAccountRequest} from "../models/createAccountModels";
import {ModelValidationError} from "../exceptions/exceptions";

export function validateCreateCapstoneAccountRequest(request: CreateCapstoneAccountRequest) {
  if(!request.accountType || request.accountType === ' ') {
    throw new ModelValidationError('Invalid account type on account create request. Request denied.')
  }
  if(!request.initialDeposit) {
    throw new ModelValidationError('Invalid initial deposit on account create request. Request denied.')
  }
}
