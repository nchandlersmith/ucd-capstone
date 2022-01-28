import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createDynamoDBClient } from "../utils/dynamodbUtils";
import {createLogger} from "../utils/logger";
import {authorize} from "../utils/authUtils";

const logger = createLogger('Get Account')

const requiredHeaders = {
  'access-control-allow-origin': '*'
}

export const handler = async function(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const tableName = process.env.ACCOUNTS_TABLE_NAME || 'Accounts'
  const authHeader = event.headers.Authorization

  try {
    authorize(authHeader)
  } catch {
    logger.info(`Auth error with Authorization header: ${authHeader}`)
    return {
      statusCode: 403,
      headers: requiredHeaders,
      body: JSON.stringify({error: 'User not authorized'})
    }
  }

  const dynamoClient = createDynamoDBClient()
  const params = {
    TableName: tableName,
    ExpressionAttributeValues: { ':userId': 'Ghost Rider' },
    KeyConditionExpression: 'userId = :userId'
  }
  const dbResult = await dynamoClient.query(params).promise()
  logger.info(`Number of items returned from DynamoDB: ${dbResult.Items?.length}`)
  const response = {
    accounts: dbResult.Items
  }
  
  return {
    statusCode: 200,
    headers: requiredHeaders,
    body:JSON.stringify(response)
  }
}
