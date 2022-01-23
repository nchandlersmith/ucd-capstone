import AWS from 'aws-sdk'
import AWSMock from 'aws-sdk-mock'
import { handler } from "./createAccount"
import { CreateAccountRequest, CreateAccountResponse, CreateAccountDao } from "./createAccountModels"
import { buildEvent } from './testUtils/eventUtils'

describe('createAccount', () => {
  const expectedHeaders = {
    'access-control-allow-origin': '*'
  }
  const userId = 'Authorized User'
  const validAuthHeader = {Authorization: `Bearer blarg-${userId}`}

  beforeEach(() => {
    AWSMock.setSDKInstance(AWS)
  })

  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient')
  })

  it('should return account information', async () => {
    const accountType = 'Free Checking'
    const initialDeposit = 1000
    const body = JSON.stringify(buildCreateAccountRequest(accountType, initialDeposit))
    const headers = validAuthHeader
    buildCreateAccountMock()

    const response = await handler(buildEvent({body, headers}))
    
    expect(response.statusCode).toEqual(201)
    const account: CreateAccountResponse = JSON.parse(response.body)
    expect(account.accountId).not.toBeNull()
    expect(account.accountId).toContain('-')
    expect(account.accountType).toEqual(accountType)
    expect(account.balance).toEqual(initialDeposit)
    expect(account.createdOn).not.toBeNull()
    expect(response.headers).toEqual(expectedHeaders)
  })

  it('should fail when the account type is missing from request', async () => {
    const initialDeposit = 1234
    const {accountType: _a, ...requestMissingAccountType } = buildCreateAccountRequest('', initialDeposit)
    const body = JSON.stringify(requestMissingAccountType)
    const headers = validAuthHeader
    const expectedErrorResponse = JSON.stringify({
      error: 'Missing from body: accountType'
    })
    buildCreateAccountMock()

    const response = await handler(buildEvent({body, headers}))

    expect(response.statusCode).toEqual(400)
    expect(response.body).toStrictEqual(expectedErrorResponse)
    expect(response.headers).toStrictEqual(expectedHeaders)
  })

  it('should fail when the account type is empty', async () => {
    const accountType = ''
    const initialDeposit = 1234
    const body = JSON.stringify(buildCreateAccountRequest(accountType, initialDeposit))
    const headers = validAuthHeader
    const expectedErrorResponse = JSON.stringify({
      error: 'accountType cannot be empty'
    })
    buildCreateAccountMock()
  
    const response = await handler(buildEvent({body, headers}))
  
    expect(response.statusCode).toEqual(400)
    expect(response.body).toStrictEqual(expectedErrorResponse)
    expect(response.headers).toStrictEqual(expectedHeaders)
  })

  it('should fail when the account type is blank', async () => {
    const accountType = ' '
    const initialDeposit = 1234
    const body = JSON.stringify(buildCreateAccountRequest(accountType, initialDeposit))
    const headers = validAuthHeader
    const expectedErrorResponse = JSON.stringify({
      error: 'accountType cannot be blank'
    })
    buildCreateAccountMock()
  
    const response = await handler(buildEvent({body, headers}))
  
    expect(response.statusCode).toEqual(400)
    expect(response.body).toStrictEqual(expectedErrorResponse)
    expect(response.headers).toStrictEqual(expectedHeaders)
  })

  it('should fail when the initial deposit is missing from request', async () => {
    const accountType = 'Free Checking'
    const {initialDeposit: _a, ...requestMissingInitialDeposit } = buildCreateAccountRequest(accountType, 0)
    const body = JSON.stringify(requestMissingInitialDeposit)
    const headers = validAuthHeader
    const expectedErrorResponse = JSON.stringify({
      error: 'Missing from body: initialDeposit'
    })
    buildCreateAccountMock()

    const response = await handler(buildEvent({body, headers}))

    expect(response.statusCode).toEqual(400)
    expect(response.body).toStrictEqual(expectedErrorResponse)
    expect(response.headers).toStrictEqual(expectedHeaders)
  })

  it('should reject requests missing the auth header', async function() {
    const expectedErrorMessage = JSON.stringify({error: 'User not authorized'})
    const response = await handler(buildEvent({headers: {}}))

    expect(response.statusCode).toEqual(403)
    expect(response.headers).toStrictEqual(expectedHeaders)
    expect(response.body).toStrictEqual(expectedErrorMessage)
  })

  it('should reject unauthorized users', async () => {
    const expectedErrorMessage = JSON.stringify({error: 'User not authorized'})

    const response = await handler(buildEvent({headers: {Authorization: `Bearer ${userId}`}}))

    expect(response.statusCode).toEqual(403)
    expect(response.headers).toStrictEqual(expectedHeaders)
    expect(response.body).toStrictEqual(expectedErrorMessage)
  })
})

function buildCreateAccountMock() {
  AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: CreateAccountDao, callback: Function) => {
    console.log(' Doc client called!!!')
    callback(null, { Foo: 'bar' })
  })
}

function buildCreateAccountRequest(accountType: string, initialDeposit: number): CreateAccountRequest {
  return {
    accountType,
    initialDeposit
  }
}
