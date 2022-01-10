import { APIGatewayEventDefaultAuthorizerContext, APIGatewayEventIdentity, APIGatewayEventRequestContextWithAuthorizer, APIGatewayProxyEvent } from "aws-lambda"
import { handler } from "./createAccount"
import { CreateAccountRequest, CreateAccountResponse } from "./createAccountModels"

describe('createAccount', () => {
    it('should return account information', async () => {
      const accountType = 'Checking'
      const initialDeposit = 1000
      const request = buildRequestBody(accountType, initialDeposit)

      const response = await handler(buildEvent(JSON.stringify(request)))
      
      expect(response.statusCode).toEqual(201)
      const accountInfo: CreateAccountResponse = JSON.parse(response.body)?.accountInfo
      expect(accountInfo.accountId).not.toBeNull()
      expect(accountInfo.accountType).toEqual(accountType)
      expect(accountInfo.balance).toEqual(initialDeposit)
    })
})

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