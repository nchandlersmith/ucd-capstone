import {CapstoneAccount} from "../models/getAccountsModels"
import { DateTime } from 'luxon'
import {getUserAccounts} from "./getAccountsService";

const expectedAccountsList: CapstoneAccount[] = [{
    userId: 'some user',
    accountId: '123456',
    accountType: 'test checking',
    balance: 1234,
    createdOn: DateTime.now().toISO()
  }]

  jest.mock("../persistence/dbClient", () => {
    return {
      getAccountsByUser: jest.fn(() => {return {Items: expectedAccountsList}})
    }
  })

describe('getAccountsService.ts', () => {
  it('should return a list of accounts', async () => {
    const result = await getUserAccounts('some user')
    expect(result.length).toEqual(1)
    expect(result).toStrictEqual(expectedAccountsList)
  })
})
