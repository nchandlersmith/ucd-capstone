import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateAccountRequest, CreateAccountDao, CreateAccountResponse } from './createAccountModels'
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createDynamoDBClient } from './utils/dynamodbUtilities'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const tableName = process.env.ACCOUNTS_TABLE_NAME || 'Accounts'
  const request: CreateAccountRequest = event.body ? JSON.parse(event.body) : {}

  if (request.accountType === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({error: 'Missing from body: accountType'})
    }
  }

  if (request.accountType === '') {
    return {
      statusCode: 400,
      body: JSON.stringify({error: 'accountType cannot be empty'})
    }
  }

  if (request.accountType === ' ') {
    return {
      statusCode: 400,
      body: JSON.stringify({error: 'accountType cannot be blank'})
    }
  }

  const item = buildCreateAccountItem(request)
  console.log(`To table: ${tableName} adding item : ${JSON.stringify(item)}`)

  const result: DocumentClient.PutItemOutput = await createDynamoDBClient().put({
    TableName: tableName,
    Item: item
  }).promise()

  console.log(`result from dynamo ${JSON.stringify(result)}`)

  const response: CreateAccountResponse = {
    accountId: item.accountId,
    accountType: item.accountType,
    balance: item.balance,
    createdOn: item.createdOn
  }

  return {
    statusCode: 201,
    body: JSON.stringify(response)
  }
}

function buildCreateAccountItem(request: CreateAccountRequest): CreateAccountDao {
  return {
    userId: getUserId(),
    accountId: uuid.v4(),
    accountType: request.accountType,
    balance: request.initialDeposit,
    createdOn: Date().toString()
  }
}

function getUserId() {
  return 'Ghost Rider'
}