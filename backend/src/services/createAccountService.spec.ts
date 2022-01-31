import {buildCreateAccountItem, validateCreateCapstoneAccountRequest} from "./createAccountService";
import {ModelValidationError} from "../exceptions/exceptions";
import {CreateCapstoneAccountDao, CreateCapstoneAccountRequest} from "../models/createAccountModels";
import {v4 as uuidv4} from 'uuid'

const expectedAccountId = 'abc123'
jest.mock('uuid', () => ({ v4: () => expectedAccountId}))

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
    })
  })

  describe('buildCreateAccountItem', () => {
    it('should build an create account item', () => {
      const request: CreateCapstoneAccountRequest = {
        accountType: 'some account type',
        initialDeposit: 12345
      }
      const expectedCreateAccountItem: CreateCapstoneAccountDao = {
        userId: 'some user id',
        accountId: expectedAccountId,
        accountType: request.accountType,
        createdOn: '',
        balance: request.initialDeposit
      }

      const result = buildCreateAccountItem(request, expectedCreateAccountItem.userId)
      expect(result).toEqual(expectedCreateAccountItem)
    })
  })
})
