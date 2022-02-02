import { handler } from "./createAccountLambda"
import { CreateCapstoneAccountRequest } from "../models/createAccountModels"
import { buildEvent } from '../testUtils/eventUtils'

const createAccountServiceMock = (mock: any) => {
  jest.mock('../services/CreateAccountService', () => {
    return {
      createCapstoneAccount: mock
    }
  })
}

describe('createAccount', () => {
  createAccountServiceMock(() => {})
  const expectedHeaders = {
    'access-control-allow-origin': '*'
  }
  const userId = 'Authorized Unit Test User'
  const validAuthHeader = {Authorization: `Bearer blarg-${userId}`}

  it('should return success', async () => {
    const accountType = 'Free Checking'
    const initialDeposit = 1000
    const requestBody = JSON.stringify(buildCreateAccountRequest(accountType, initialDeposit))
    const headers = validAuthHeader
    const expectedResponseBody = JSON.stringify({message: 'Success'})

    const response = await handler(buildEvent({body: requestBody, headers}))
    
    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(expectedResponseBody)
    expect(response.headers).toEqual(expectedHeaders)
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

function buildCreateAccountRequest(accountType: string, initialDeposit: number): CreateCapstoneAccountRequest {
  return {
    accountType,
    initialDeposit
  }
}
