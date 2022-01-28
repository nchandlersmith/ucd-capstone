import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateAccountRequest, CreateAccountDao, CreateAccountResponse } from './createAccountModels'
import * as uuid from 'uuid'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createDynamoDBClient } from './utils/dynamodbUtils'
import { createLogger } from './utils/logger'
import {authorize} from "./utils/authUtils";
import {AuthError} from "./exceptions/exceptions";

const logger = createLogger('Create Account')
const requiredResponseHeaders = {
  'access-control-allow-origin': '*'
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const tableName = process.env.ACCOUNTS_TABLE_NAME || 'Accounts'
  const request: CreateAccountRequest = event.body ? JSON.parse(event.body) : {}

  const authHeader = event.headers.Authorization
  try {
    authorize(authHeader)
    validateAccountType(request)
    validateInitialDeposit(request)
  } catch(err) {
    if (err instanceof AuthError) {
      return {
        statusCode: 403,
        headers: {'access-control-allow-origin': '*'},
        body:JSON.stringify({error: err.message})
      }
    }
    const error = err as Error
    logger.error(`Request to create account invalid. ${error.message}`)
    return {
      statusCode: 400,
      headers: requiredResponseHeaders,
      body: JSON.stringify({error: error.message})
    }
  }

  const item = buildCreateAccountItem(request)
  logger.info(`To table: ${tableName} adding item : ${JSON.stringify(item)}`)

  const result: DocumentClient.PutItemOutput = await createDynamoDBClient().put({
    TableName: tableName,
    Item: item
  }).promise()

  logger.info(`result from dynamo ${JSON.stringify(result)}`)

  const response: CreateAccountResponse = {
    accountId: item.accountId,
    accountType: item.accountType,
    balance: item.balance,
    createdOn: item.createdOn
  }

  return {
    statusCode: 201,
    headers: requiredResponseHeaders,
    body: JSON.stringify(response)
  }
}

function validateAccountType(request: CreateAccountRequest) {
  if (request.accountType === undefined) {
    throw new Error('Missing from body: accountType')
  }

  if (request.accountType === '') {
    throw new Error('accountType cannot be empty')
  }

  if (request.accountType === ' ') {
    throw new Error('accountType cannot be blank')
  }
}

function validateInitialDeposit(request: CreateAccountRequest) {
  if (request.initialDeposit === undefined) {
    throw new Error('Missing from body: initialDeposit')
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
