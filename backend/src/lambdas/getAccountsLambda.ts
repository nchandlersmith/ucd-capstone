import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createDynamoDBClient } from "../persistence/dbClient";
import {createLogger} from "../utils/logger";
import {authorize} from "../utils/authUtils";
import {errorResponseBuilder, responseBuilder} from "../utils/responseUtils";

const logger = createLogger('Get Account')

export const handler = async function(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const tableName = process.env.CAPSTONE_ACCOUNTS_TABLE_NAME || ''
  const authHeader = event.headers.Authorization

  try {
    const user = authorize(authHeader)
    const dbResult = await getAccountsForUser(tableName, user)
    return responseBuilder(200, {accounts: dbResult.Items})
  } catch(err) {
    logger.info(`Auth error with Authorization header: ${authHeader}`)
    const error = err as Error
    return errorResponseBuilder(error)
  }
}

async function getAccountsForUser(tableName: string, userId: string) {
  const dynamoClient = createDynamoDBClient()
  const params = {
    TableName: tableName,
    ExpressionAttributeValues: {':userId': userId},
    KeyConditionExpression: 'userId = :userId'
  }
  const dbResult = await dynamoClient.query(params).promise()
  logger.info(`Number of items returned from DynamoDB: ${dbResult.Items?.length}`)
  return dbResult;
}
