import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createDynamoDBClient } from "./utils/dynamodbUtils";

const requiredHeaders = {
  'access-control-allow-origin': '*'
}

export const handler = async function(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const tableName = process.env.ACCOUNTS_TABLE_NAME || 'Accounts'
  console.log(`table name: ${tableName}`)
  const authHeader = event.headers.Authorization
  if (authHeader === undefined || !authHeader.includes('blarg')) {
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
  console.log(`Number of items returned from DynamoDB: ${dbResult.Items?.length}`)
  const response = {
    accounts: dbResult.Items
  }
  
  return {
    statusCode: 200,
    headers: requiredHeaders,
    body:JSON.stringify(response)
  }
}
