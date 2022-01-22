import { APIGatewayProxyEvent, APIGatewayEventRequestContextWithAuthorizer, APIGatewayEventDefaultAuthorizerContext, APIGatewayEventIdentity } from "aws-lambda"

export function buildEvent(body: string): APIGatewayProxyEvent {
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