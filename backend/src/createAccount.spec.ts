import AWSMock from 'aws-sdk-mock'
import AWS from 'aws-sdk'
import { APIGatewayEventDefaultAuthorizerContext, APIGatewayEventIdentity, APIGatewayEventRequestContextWithAuthorizer, APIGatewayProxyEvent } from "aws-lambda"
import { handler } from "./createAccount"
import { CreateAccountRequest, CreateAccountResponse, CreateAccountDao } from "./createAccountModels"

describe('createAccount', () => {

  beforeEach(() => {
    AWSMock.setSDKInstance(AWS)
  })

  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient')
  })

  it('should return account information', async () => {
    const accountType = 'Free Checking'
    const initialDeposit = 1000
    const request = buildRequestBody(accountType, initialDeposit)
    buildCreateAccountMock()

    const response = await handler(buildEvent(JSON.stringify(request)))
    
    expect(response.statusCode).toEqual(201)
    const account: CreateAccountResponse = JSON.parse(response.body)
    expect(account.accountId).not.toBeNull()
    expect(account.accountId).toContain('-')
    expect(account.accountType).toEqual(accountType)
    expect(account.balance).toEqual(initialDeposit)
    expect(account.createdOn).not.toBeNull()
  })

  it('should fail when the account type is missing from request', async () => {
    const initialDeposit = 1234
    const {accountType: _a, ...requestMissingAccountType } = buildRequestBody('', initialDeposit)
    const expectedErrorResponse = JSON.stringify({
      error: 'Missing from body: accountType'
    })
    buildCreateAccountMock()

    const response = await handler(buildEvent(JSON.stringify(requestMissingAccountType)))

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(expectedErrorResponse)
  })

  it('should fail when the account type is empty', async () => {
    const accountType = ''
    const initialDeposit = 1234
    const request = buildRequestBody(accountType, initialDeposit)
    const expectedErrorResponse = JSON.stringify({
      error: 'accountType cannot be empty'
    })
    buildCreateAccountMock()
  
    const response = await handler(buildEvent(JSON.stringify(request)))
  
    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(expectedErrorResponse)
  })

  it('should fail when the account type is blank', async () => {
    const accountType = ' '
    const initialDeposit = 1234
    const request = buildRequestBody(accountType, initialDeposit)
    const expectedErrorResponse = JSON.stringify({
      error: 'accountType cannot be blank'
    })
    buildCreateAccountMock()
  
    const response = await handler(buildEvent(JSON.stringify(request)))
  
    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual(expectedErrorResponse)
  })
})

function buildCreateAccountMock() {
  AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: CreateAccountDao, callback: Function) => {
    console.log(' Doc client called!!!')
    callback(null, { Foo: 'bar' })
  })
}

function buildRequestBody(accountType: string, initialDeposit: number): CreateAccountRequest {
  return {
    accountType,
    initialDeposit
  }
}

function buildEvent(body: string): APIGatewayProxyEvent {
  return {
    resource: '',
    path: '',
    httpMethod: '',
    headers: {},
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: buildRequestContext(),
    body,
    isBase64Encoded: false
  }
}

function buildRequestContext(): APIGatewayEventRequestContextWithAuthorizer<APIGatewayEventDefaultAuthorizerContext> {
  return {
    accountId: '',
    apiId: '',
    authorizer: null,
    domainName: '',
    domainPrefix: '',
    extendedRequestId: '',
    httpMethod: '',
    identity: buildAPIGatewayEventIdentity(),
    path: '',
    protocol: '',
    resourceId: '',
    resourcePath: '',
    requestTime: '',
    stage: '',
    requestId: '',
    requestTimeEpoch: 0
  }
}

function buildAPIGatewayEventIdentity(): APIGatewayEventIdentity {
  return {
    accessKey: null,
    accountId: null,
    apiKey: '',
    apiKeyId: '',
    caller: null,
    clientCert: null,
    cognitoAuthenticationProvider: null,
    cognitoAuthenticationType: null,
    cognitoIdentityId: null,
    cognitoIdentityPoolId: null,
    principalOrgId: null,
    sourceIp: '',
    userArn: null,
    userAgent: '',
    user: null
  }
}