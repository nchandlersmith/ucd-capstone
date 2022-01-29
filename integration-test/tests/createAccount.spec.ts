import {deleteAccountByUserAndAccountIds, findAllAccountsForUserId} from "../utils/dynamoUtils";

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
      'initialDeposit': 3145
    }

    const result = await axios.post(accountsUrl, createAccountData, {headers})

    const dynamoResponse = await findAllAccountsForUserId(userId)
    expect(result.status).toEqual(201)
    expect(dynamoResponse.Items?.length).toEqual(1)
    expect(dynamoResponse.Items[0].accountId).toBeTruthy()
    expect(dynamoResponse.Items[0].accountType).toBe(createAccountData.accountType)
    expect(dynamoResponse.Items[0].balance).toBe(createAccountData.initialDeposit)
  })

  it('should reject requests when accountType is missing', async () => {
    const createAccountData = {
      'initialDeposit': 3145
    }
    const expectedErrorMessage = 'Missing from body: accountType'

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
    const expectedErrorMessage = 'Missing from body: initialDeposit'

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

