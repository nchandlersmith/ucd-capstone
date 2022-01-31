import AWS from 'aws-sdk'
import AWSMock from 'aws-sdk-mock'
import { handler } from "./createAccountLambda"
import { CreateCapstoneAccountRequest, CreateCapstoneAccountDao } from "../models/createAccountModels"
import { buildEvent } from '../testUtils/eventUtils'

describe('createAccount', () => {
  const expectedHeaders = {
    'access-control-allow-origin': '*'
  }
  const userId = 'Authorized Unit Test User'
  const validAuthHeader = {Authorization: `Bearer blarg-${userId}`}
  const invalidAccountTypeErrorMessage = 'Invalid account type on account create request. Request denied.'
  const invalidInitialDepositErrorMessage = 'Invalid initial deposit on account create request. Request denied.'

  beforeEach(() => {
    AWSMock.setSDKInstance(AWS)
  })

  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient')
  })

  it('should return success', async () => {
    const accountType = 'Free Checking'
    const initialDeposit = 1000
    const requestBody = JSON.stringify(buildCreateAccountRequest(accountType, initialDeposit))
    const headers = validAuthHeader
    const expectedResponseBody = JSON.stringify({message: 'Success'})
    buildCreateAccountMock()

    const response = await handler(buildEvent({body: requestBody, headers}))
    
    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(expectedResponseBody)
    expect(response.headers).toEqual(expectedHeaders)
  })

  it('should fail when the account type is missing from request', async () => {
    const initialDeposit = 1234
    const {accountType: _a, ...requestMissingAccountType } = buildCreateAccountRequest('', initialDeposit)
    const body = JSON.stringify(requestMissingAccountType)
    const headers = validAuthHeader
    const expectedErrorResponse = JSON.stringify({
      error: invalidAccountTypeErrorMessage
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
      error: invalidAccountTypeErrorMessage
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
      error: invalidAccountTypeErrorMessage
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
      error: invalidInitialDepositErrorMessage
    })
    buildCreateAccountMock()

    const response = await handler(buildEvent({body, headers}))

    expect(response.statusCode).toEqual(400)
    expect(response.body).toStrictEqual(expectedErrorResponse)
    expect(response.headers).toStrictEqual(expectedHeaders)
  })

  it('should reject requests missing the auth header', async function() {
    const expectedErrorMessage = JSON.stringify({error: 'Unauthorized user'})
    const response = await handler(buildEvent({headers: {}}))

    expect(response.statusCode).toEqual(403)
    expect(response.headers).toStrictEqual(expectedHeaders)
    expect(response.body).toStrictEqual(expectedErrorMessage)
  })

  it('should reject unauthorized users', async () => {
    const expectedErrorMessage = JSON.stringify({error: 'Unauthorized user'})

    const response = await handler(buildEvent({headers: {Authorization: `Bearer ${userId}`}}))

    expect(response.statusCode).toEqual(403)
    expect(response.headers).toStrictEqual(expectedHeaders)
    expect(response.body).toStrictEqual(expectedErrorMessage)
  })
})

function buildCreateAccountMock() {
  AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: CreateCapstoneAccountDao, callback: Function) => {
    callback(null, { Foo: 'bar' })
  })
}

function buildCreateAccountRequest(accountType: string, initialDeposit: number): CreateCapstoneAccountRequest {
  return {
    accountType,
    initialDeposit
  }
}
