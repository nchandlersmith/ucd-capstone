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

export const errorResponseBuilder = (err: any): APIGatewayProxyResult => {
  const statusCode = 500
  let body
  if (err instanceof Error) {
    body = {error: err.message}
  } else {
    const error = err as string
    body = {error}
  }
  return responseBuilder(statusCode, body)
}
