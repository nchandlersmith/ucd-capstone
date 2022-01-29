import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateCapstoneAccountRequest, CreateCapstoneAccountDao, CreateCapstoneAccountResponse } from '../models/createAccountModels'
import * as uuid from 'uuid'
import {storeCapstoneAccount} from '../persistence/dbClient'
import { createLogger } from '../utils/logger'
import {authorize} from "../utils/authUtils";
import {AuthError, ModelValidationError} from "../exceptions/exceptions";
import {validateCreateCapstoneAccountRequest} from "../services/createAccountService";

const logger = createLogger('Create Account')
const requiredResponseHeaders = {
  'access-control-allow-origin': '*'
}

const buildAuthErrorResponse = (errorMessage: string): APIGatewayProxyResult => {
  return {
    statusCode: 403,
    headers: {'access-control-allow-origin': '*'},
    body: JSON.stringify({error: errorMessage})
  }
}

function buildValidationErrorResponse(error: Error) {
  return {
    statusCode: 400,
    headers: requiredResponseHeaders,
    body: JSON.stringify({error: error.message})
  };
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const tableName = process.env.CAPSTONE_ACCOUNTS_TABLE_NAME || ''
  const request: CreateCapstoneAccountRequest = event.body ? JSON.parse(event.body) : {}

  const authHeader = event.headers.Authorization
  try {
    authorize(authHeader)
    validateCreateCapstoneAccountRequest(request)
  } catch(err: unknown) {
    const error = err as Error // TODO: could also be a string
    logger.error(`Error creating Capstone Account. ${error.message}`)
    if (error instanceof AuthError) {
      return buildAuthErrorResponse(error.message)
    }
    if (error instanceof ModelValidationError) {
      return buildValidationErrorResponse(error)
    }
    return {
      statusCode: 500,
      headers: requiredResponseHeaders,
      body: JSON.stringify({error: error.message})
    }
  }

  const item = buildCreateAccountItem(request)
  logger.info(`To table: ${tableName} adding item : ${JSON.stringify(item)}`)

  await storeCapstoneAccount(item)
  const response: CreateCapstoneAccountResponse = {
    message: 'Success'
  }

  return {
    statusCode: 201,
    headers: requiredResponseHeaders,
    body: JSON.stringify(response)
  }
}

function buildCreateAccountItem(request: CreateCapstoneAccountRequest): CreateCapstoneAccountDao {
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
