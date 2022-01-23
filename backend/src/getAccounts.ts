import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createDynamoDBClient } from "./utils/dynamodbUtils";

const requiredHeaders = {
  'access-control-allow-origin': '*'
}

export const handler = async function(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const authHeader = event.headers.Authorization
  if (authHeader === undefined || !authHeader.includes('blarg')) {
    return {
      statusCode: 403,
      headers: requiredHeaders,
      body: JSON.stringify({error: 'User not authorized'})
    }
  }

  const dynamoClient = createDynamoDBClient()
  const dbResult = await dynamoClient.query({TableName: ''},).promise()
  const response = {
    accounts: dbResult.Items
  }
  
  return {
    statusCode: 200,
    headers: requiredHeaders,
    body:JSON.stringify(response)
  }
}