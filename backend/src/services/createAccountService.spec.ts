import {buildCreateCapstoneAccountItem, validateCreateCapstoneAccountRequest} from "./createAccountService";
import {ModelValidationError} from "../exceptions/exceptions";
import {CreateCapstoneAccountDao, CreateCapstoneAccountRequest} from "../models/createAccountModels";
import {DateTime} from "luxon";

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
    beforeAll(() => {
      const timestamp = 1643593211687
      jest.useFakeTimers('modern')
      jest.setSystemTime(timestamp)
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('should build an create account item', () => {
      const request: CreateCapstoneAccountRequest = {
        accountType: 'some account type',
        initialDeposit: 12345
      }
      const expectedCreateAccountItem: CreateCapstoneAccountDao = {
        userId: 'some user id',
        accountId: expectedAccountId,
        accountType: request.accountType,
        createdOn: DateTime.now().toISO(),
        balance: request.initialDeposit
      }

      const result = buildCreateCapstoneAccountItem(request, expectedCreateAccountItem.userId)

      expect(result.userId).toEqual(expectedCreateAccountItem.userId)
      expect(result.accountId).toEqual(expectedCreateAccountItem.accountId)
      expect(result.accountType).toEqual(expectedCreateAccountItem.accountType)
      expect(result.balance).toEqual(expectedCreateAccountItem.balance)
      const timestampDifference =
        Math.abs(
        DateTime.fromISO(result.createdOn).toMillis()
           - DateTime.fromISO(expectedCreateAccountItem.createdOn).toMillis())
      expect(timestampDifference).toBeLessThan(100)
    })
  })
})
