import {validateCreateCapstoneAccountRequest} from "./createAccountService";
import {ModelValidationError} from "../exceptions/exceptions";

describe('createAccountService', () => {
  describe('validateCreateCapstoneAccountRequest', () => {
    const invalidAccountTypeErrorMessage = /^Invalid account type on account create request. Request denied.$/
    const invalidInitialDepositErrorMessage = /^Invalid initial deposit on account create request. Request denied.$/

    it('should throw error when accountType is null', () => {
      const request = { accountType: null, initialDeposit: 0 }
      // @ts-ignore
      expect(() => validateCreateCapstoneAccountRequest(request)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => validateCreateCapstoneAccountRequest(request)).toThrow(invalidAccountTypeErrorMessage)
    });

    it('should throw error when accountType is undefined', () => {
      const request = { accountType: undefined, initialDeposit: 0 }
      // @ts-ignore
      expect(() => validateCreateCapstoneAccountRequest(request)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => validateCreateCapstoneAccountRequest(request)).toThrow(invalidAccountTypeErrorMessage)
    });

    it('should throw error when accountType is empty', () => {
      const request = { accountType: '', initialDeposit: 0 }
      expect(() => validateCreateCapstoneAccountRequest(request)).toThrow(ModelValidationError)
      expect(() => validateCreateCapstoneAccountRequest(request)).toThrow(invalidAccountTypeErrorMessage)
    });

    it('should throw error when accountType is blank', () => {
      const request = { accountType: ' ', initialDeposit: 0 }
      expect(() => validateCreateCapstoneAccountRequest(request)).toThrow(ModelValidationError)
      expect(() => validateCreateCapstoneAccountRequest(request)).toThrow(invalidAccountTypeErrorMessage)
    });

    it('should throw error when initialDeposit is null', () => {
      const request = { accountType: 'Free Checking', initialDeposit: null }
      // @ts-ignore
      expect(() => validateCreateCapstoneAccountRequest(request)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => validateCreateCapstoneAccountRequest(request)).toThrow(invalidInitialDepositErrorMessage)
    });

    it('should throw error when initialDeposit is undefined', () => {
      const request = { accountType: 'Free Checking', initialDeposit: undefined }
      // @ts-ignore
      expect(() => validateCreateCapstoneAccountRequest(request)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => validateCreateCapstoneAccountRequest(request)).toThrow(invalidInitialDepositErrorMessage)
    });

    it('should throw error when initialDeposit is 0', () => {
      const request = { accountType: 'Free Checking', initialDeposit: 0 }
      expect(() => validateCreateCapstoneAccountRequest(request)).toThrow(ModelValidationError)
      expect(() => validateCreateCapstoneAccountRequest(request)).toThrow(invalidInitialDepositErrorMessage)
    });
  })
})
