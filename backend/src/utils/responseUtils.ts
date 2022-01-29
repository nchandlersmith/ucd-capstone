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
  const body = err.constructor.name === 'Error' ? { error: err.message } : {error: err.toString()}
  return responseBuilder(statusCode, body)
}
