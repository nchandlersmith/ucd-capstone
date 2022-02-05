import {createCapstoneAccount} from "./createAccountService";
import {ModelValidationError} from "../exceptions/exceptions";

const expectedAccountId = 'abc123'
jest.mock('uuid', () => ({v4: jest.fn(() => expectedAccountId)}))

describe('createAccountService', () => {
  describe('createCapstoneAccount', () => {
    const invalidAccountTypeErrorMessage = /^Invalid account type on account create request. Request denied.$/
    const invalidInitialDepositErrorMessage = /^Invalid initial deposit on account create request. Request denied.$/
    const invalidUserIdErrorMessage = /^User authorized. Userid not recognized. Request denied.$/
    const userId = 'some user'

    it('should throw error when accountType is null', () => {
      const request = {accountType: null, initialDeposit: 0}
      // @ts-ignore
      expect(() => createCapstoneAccount(request, userId)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => createCapstoneAccount(request, userId)).toThrow(invalidAccountTypeErrorMessage)
    });

    it('should throw error when accountType is undefined', () => {
      const request = {accountType: undefined, initialDeposit: 0}
      // @ts-ignore
      expect(() => createCapstoneAccount(request, userId)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => createCapstoneAccount(request, userId)).toThrow(invalidAccountTypeErrorMessage)
    });

    it('should throw error when accountType is empty', () => {
      const request = {accountType: '', initialDeposit: 0}
      expect(() => createCapstoneAccount(request, userId)).toThrow(ModelValidationError)
      expect(() => createCapstoneAccount(request, userId)).toThrow(invalidAccountTypeErrorMessage)
    });

    it('should throw error when accountType is blank', () => {
      const request = {accountType: ' ', initialDeposit: 0}
      expect(() => createCapstoneAccount(request, userId)).toThrow(ModelValidationError)
      expect(() => createCapstoneAccount(request, userId)).toThrow(invalidAccountTypeErrorMessage)
    });

    it('should throw error when initialDeposit is null', () => {
      const request = {accountType: 'Free Checking', initialDeposit: null}
      // @ts-ignore
      expect(() => createCapstoneAccount(request, userId)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => createCapstoneAccount(request, userId)).toThrow(invalidInitialDepositErrorMessage)
    });

    it('should throw error when initialDeposit is undefined', () => {
      const request = {accountType: 'Free Checking', initialDeposit: undefined}
      // @ts-ignore
      expect(() => createCapstoneAccount(request, userId)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => createCapstoneAccount(request, userId)).toThrow(invalidInitialDepositErrorMessage)
    });

    it('should throw error when initialDeposit is 0', () => {
      const request = {accountType: 'Free Checking', initialDeposit: 0}
      expect(() => createCapstoneAccount(request, userId)).toThrow(ModelValidationError)
      expect(() => createCapstoneAccount(request, userId)).toThrow(invalidInitialDepositErrorMessage)
    })

    it('should throw error when userId is null', () => {
      const validRequest = {accountType: 'Test Checking', initialDeposit: 12345}
      expect(() => createCapstoneAccount(validRequest, null)).toThrow(Error)
      expect(() => createCapstoneAccount(validRequest, null)).toThrow(invalidUserIdErrorMessage)
    })

    it('should throw error when userId is undefined', () => {
      const validRequest = {accountType: 'Test Checking', initialDeposit: 12345}
      expect(() => createCapstoneAccount(validRequest, undefined)).toThrow(Error)
      expect(() => createCapstoneAccount(validRequest, undefined)).toThrow(invalidUserIdErrorMessage)
    })

    it('should throw error when userId is empty string', () => {
      const validRequest = {accountType: 'Test Checking', initialDeposit: 12345}
      expect(() => createCapstoneAccount(validRequest, undefined)).toThrow(Error)
      expect(() => createCapstoneAccount(validRequest, undefined)).toThrow(invalidUserIdErrorMessage)
    })
  })
})
