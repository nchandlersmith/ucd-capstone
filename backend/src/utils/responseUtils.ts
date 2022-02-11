import {APIGatewayProxyResult} from "aws-lambda";

const requiredHeaders = {
  'access-control-allow-origin': '*'
}

export const responseBuilder = (statusCode: number, body: any): APIGatewayProxyResult => {
  return {
    statusCode: statusCode,
    headers: requiredHeaders,
    body: JSON.stringify(body)
  }
}

export const errorResponseBuilder = (err: Error | string): APIGatewayProxyResult => {
  // @ts-ignore
  const statusCode = errorMap[err.constructor.name] || 500
  const body = err instanceof Error ? { error: err.message } : {error: err.toString()}
  return responseBuilder(statusCode, body)
}

const errorMap = {
  "AuthError": 403,
  "ModelValidationError": 400
}
