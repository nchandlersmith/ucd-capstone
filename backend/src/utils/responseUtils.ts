import {APIGatewayProxyResult} from "aws-lambda";
import {createLogger} from "./logger";

const logger = createLogger("responseUtils")

const requiredHeaders = {
  'access-control-allow-origin': '*'
}

export const responseBuilder = (statusCode: number, body: any): APIGatewayProxyResult => {
  const response: APIGatewayProxyResult = {
    statusCode: statusCode,
    headers: requiredHeaders,
    body: JSON.stringify(body)
  }
  logger.info(`Building response: ${JSON.stringify(response)}`)
  return response
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
