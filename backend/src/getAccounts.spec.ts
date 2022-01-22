import AWS from 'aws-sdk'
import AWSMock from 'aws-sdk-mock'
import { QueryInput } from 'aws-sdk/clients/dynamodb'
import { handler } from './getAccounts'
import { CapstoneAccount, GetAccountsResponse } from './getAccountsModels'
import { buildEvent } from './testUtils/eventUtils'

describe('getaccounts', function() {
  beforeEach(function() {
    AWSMock.setSDKInstance(AWS)
  })

  afterEach(function() {
    AWSMock.restore('DynamoDB.DocumentClient')
  })

  it('should return all accounts for the given userId', async function() {
    const userId = 'Ghost Rider'
    const expectedAccount: CapstoneAccount = {
      userId,
      accountId: 'abc-123-zyxw-0987',
      accountType: 'Test Savings',
      balance: 1000,
      createdOn: 'some time date stamp'
    }

    AWSMock.mock('DynamoDB.DocumentClient', 'query', (params, callback: Function) => {
      console.log('Query Dynamo mock called')
      callback(null, {Items: [expectedAccount]})
    })

    const response = await handler(buildEvent(null))

    expect(response.statusCode).toEqual(200)
    const responseBody: GetAccountsResponse = JSON.parse(response.body)
    expect(responseBody.accounts).toHaveLength(1)
    expect(responseBody.accounts[0].userId).toEqual(expectedAccount.userId)
    expect(responseBody.accounts[0].accountId).toEqual(expectedAccount.accountId)
    expect(responseBody.accounts[0].accountType).toEqual(expectedAccount.accountType)
    expect(responseBody.accounts[0].balance).toEqual(expectedAccount.balance)
    expect(responseBody.accounts[0].createdOn).toEqual(expectedAccount.createdOn)
  })
})