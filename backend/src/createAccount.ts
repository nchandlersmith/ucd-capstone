import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const request = event.body ? JSON.parse(event.body) : {}
  
  return {
    statusCode: 201,
    body: JSON.stringify({
        accountInfo: {
          accountId: '123456',
          accountType: request.accountType,
          balance: request.initialDeposit
        }
      })
  }
}
