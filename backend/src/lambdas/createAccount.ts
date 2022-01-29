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

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const tableName = process.env.CAPSTONE_ACCOUNTS_TABLE_NAME || ''
  const request: CreateCapstoneAccountRequest = event.body ? JSON.parse(event.body) : {}

  const authHeader = event.headers.Authorization
  try {
    const userId = authorize(authHeader)
    validateCreateCapstoneAccountRequest(request)
    const item = buildCreateAccountItem(request, userId)
    logger.info(`To table: ${tableName} adding item : ${JSON.stringify(item)}`)
    await storeCapstoneAccount(item)
    return buildResponse(201, {message: 'Success'})
  } catch(err: unknown) {
    const error = err as Error // TODO: could also be a string
    logger.error(`Error creating Capstone Account. ${error.message}`)
    if (error instanceof AuthError) {
      return buildAuthErrorResponse(error)
    }
    if (error instanceof ModelValidationError) {
      return buildRequestValidationErrorResponse(error)
    }
    return buildServerErrorResponse(error)
  }
}

function buildCreateAccountItem(request: CreateCapstoneAccountRequest, userId: string): CreateCapstoneAccountDao {
  return {
    userId,
    accountId: uuid.v4(),
    accountType: request.accountType,
    balance: request.initialDeposit,
    createdOn: Date().toString()
  }
}

const buildAuthErrorResponse = (error: Error): APIGatewayProxyResult => {
  return buildErrorResponse(403, error)
}

function buildRequestValidationErrorResponse(error: Error) {
  return buildErrorResponse(400, error)
}

function buildServerErrorResponse(error: Error) {
  return buildErrorResponse(500, error)
}

function buildErrorResponse(statusCode: number, error: Error) {
  return buildResponse(statusCode, {error: error.message})
}

function buildResponse(statusCode: number, body: any) {
  return {
    statusCode,
    headers: {
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify(body)
  }
}
