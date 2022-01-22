import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createDynamoDBClient } from "./utils/dynamodbUtils";

export const handler = async function(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

  const dynamoClient = createDynamoDBClient()

  const dbResult = await dynamoClient.query({TableName: ''},).promise()

  const response = {
    accounts: dbResult.Items
  }
  
  return {
    statusCode: 200,
    body:JSON.stringify(response)
  }
}