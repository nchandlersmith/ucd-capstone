import {deleteAccountByUserAndAccountIds, findAllAccountsForUserId} from '../utils/dynamoUtils';
import { CreateCapstoneAccountDao } from '../../backend/src/models/createAccountModels'
import { DateTime } from 'luxon'

const axios = require('axios')

describe('create account', () => {
  const userId = 'Ghost Rider'
  const headers = {
    Authorization: `Bearer blarg-${userId}`
  }
  const accountsUrl = 'http://localhost:3000/dev/accounts'

  afterEach(async () => {
    const dynamoResponse = await findAllAccountsForUserId(userId)

    for (const item of dynamoResponse.Items) {
      await deleteAccountByUserAndAccountIds(item.accountId, userId)
        .catch((error: any) => console.log`Error occurred while cleaning up dynamo: ${error.message}`)
    }
  })

  it('should create an account', async () => {
    const createAccountData = {
      'accountType': 'Integration Test',
      'initialDeposit': 12345
    }
    const uuidv4RegEx = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    const now = DateTime.now().toMillis()

    const result = await axios.post(accountsUrl, createAccountData, {headers})

    const dynamoResponse = await findAllAccountsForUserId(userId)
    expect(result.status).toEqual(201)
    expect(dynamoResponse.Items?.length).toEqual(1)
    const newAccount: CreateCapstoneAccountDao = dynamoResponse.Items[0]
    expect(newAccount.userId).toEqual(userId)
    expect(newAccount.accountId.length).toEqual(36)
    expect(newAccount.accountId).toMatch(uuidv4RegEx)
    expect(newAccount.accountType).toBe(createAccountData.accountType)
    expect(newAccount.balance).toBe(createAccountData.initialDeposit)
    const accountTimestamp = DateTime.fromISO(newAccount.createdOn).toMillis()
    const timestampsDeltaTolerance = 1000 //milliseconds
    const timestampDelta = Math.abs(accountTimestamp - now)
    expect(timestampDelta).toBeLessThan(timestampsDeltaTolerance)
  })

  it('should reject requests when accountType is missing', async () => {
    const createAccountData = {
      'initialDeposit': 3145
    }
    const expectedErrorMessage = 'Invalid account type on account create request. Request denied.'

    const result = await axios.post(accountsUrl, createAccountData, {headers}).catch((error: any) => error)

    const dynamoResponse = await findAllAccountsForUserId(userId)
    expect(result.response.status).toEqual(400)
    expect(result.response.data.error).toEqual(expectedErrorMessage)
    expect(dynamoResponse.Items?.length).toEqual(0)
  })

  it('should reject requests when initialDeposit is missing', async () => {
    const createAccountData = {
      'accountType': 'Another integration test'
    }
    const expectedErrorMessage = 'Invalid initial deposit on account create request. Request denied.'

    const result = await axios.post(accountsUrl, createAccountData, {headers}).catch((error: any) => error)

    const dynamoResponse = await findAllAccountsForUserId(userId)
    expect(result.response.status).toEqual(400)
    expect(result.response.data.error).toEqual(expectedErrorMessage)
    expect(dynamoResponse.Items?.length).toEqual(0)
  })

  it('should reject requests when auth header is missing', async () => {
    const expectedErrorMessage = 'Unauthorized user'

    const result = await axios.post(accountsUrl, {}, {}).catch((error: any) => error)

    expect(result.response.status).toEqual(403)
    expect(result.response.data.error).toEqual(expectedErrorMessage)
  })
})

