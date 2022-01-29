import {APIGatewayProxyResult} from "aws-lambda";

export const responseBuilder = (statusCode: number, body: any): APIGatewayProxyResult => {
  return {
    statusCode: statusCode,
    headers: {
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify(body)
  }
}
