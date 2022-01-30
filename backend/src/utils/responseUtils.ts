import {APIGatewayProxyResult} from "aws-lambda";
import {AuthError} from "../exceptions/exceptions";

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

export const errorResponseBuilder = (err: any): APIGatewayProxyResult => {
  const statusCode = err instanceof AuthError ? 403 : 500
  const body = err instanceof Error ? { error: err.message } : {error: err.toString()}
  return responseBuilder(statusCode, body)
}
