import AWS from 'aws-sdk'
import AWSMock from 'aws-sdk-mock'
import { handler } from './getAccounts'
import { CapstoneAccount, GetCapstoneAccountsResponse } from '../models/getAccountsModels'
import { buildEvent } from '../testUtils/eventUtils'

describe('getAccounts.handler', function() {
  const expectedHeaders = {
    'access-control-allow-origin': '*'
  }
  const userId = 'Authorized Unit Test User'
  const unauthorizedUserErrorMessage = "Unauthorized user"

  beforeEach(function() {
    AWSMock.setSDKInstance(AWS)
  })

  afterEach(function() {
    AWSMock.restore('DynamoDB.DocumentClient')
  })

  it('should return all accounts for the given userId', async function() {
    const expectedAccount: CapstoneAccount = {
      userId,
      accountId: 'abc-123-zyxw-0987',
      accountType: 'Test Savings',
      balance: 1000,
      createdOn: 'some time date stamp'
    }

    AWSMock.mock('DynamoDB.DocumentClient', 'query', (params: any, callback: Function) => {
      callback(null, {Items: [expectedAccount]})
    })

    const response = await handler(buildEvent({headers: {Authorization: `Bearer blarg-${userId}`}}))

    expect(response.statusCode).toEqual(200)
    const responseBody: GetCapstoneAccountsResponse = JSON.parse(response.body)
    expect(responseBody.accounts).toHaveLength(1)
    expect(responseBody.accounts[0].userId).toEqual(expectedAccount.userId)
    expect(responseBody.accounts[0].accountId).toEqual(expectedAccount.accountId)
    expect(responseBody.accounts[0].accountType).toEqual(expectedAccount.accountType)
    expect(responseBody.accounts[0].balance).toEqual(expectedAccount.balance)
    expect(responseBody.accounts[0].createdOn).toEqual(expectedAccount.createdOn)
    expect(response.headers).toStrictEqual(expectedHeaders)
  })

  it('should reject requests missing auth header', async function() {
    const expectedErrorMessage = JSON.stringify({error: unauthorizedUserErrorMessage})

    const response = await handler(buildEvent({headers:{}}))

    expect(response.statusCode).toEqual(403)
    expect(response.body).toEqual(expectedErrorMessage)
    expect(response.headers).toStrictEqual(expectedHeaders)
  })

  it('should reject unauthorized users', async function () {
    const expectedErrorMessage = JSON.stringify({error: unauthorizedUserErrorMessage})

    const response = await handler(buildEvent({headers: {Authorization: `Bearer ${userId}`}}))

    expect(response.statusCode).toEqual(403)
    expect(response.body).toEqual(expectedErrorMessage)
    expect(response.headers).toStrictEqual(expectedHeaders)
  })
})
