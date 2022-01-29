import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateCapstoneAccountRequest, CreateCapstoneAccountDao } from '../models/createAccountModels'
import * as uuid from 'uuid'
import {storeCapstoneAccount} from '../persistence/dbClient'
import { createLogger } from '../utils/logger'
import {authorize} from "../utils/authUtils";
import {validateCreateCapstoneAccountRequest} from "../services/createAccountService";

const logger = createLogger('Create Account')

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const request: CreateCapstoneAccountRequest = event.body ? JSON.parse(event.body) : {}
  const authHeader = event.headers.Authorization

  let response: APIGatewayProxyResult;
  try {
    const userId = authorize(authHeader)
    validateCreateCapstoneAccountRequest(request)
    const item = buildCreateAccountItem(request, userId)
    await storeCapstoneAccount(item)
    response = buildResponse(201, {message: 'Success'})
  } catch(err: unknown) {
    response = handleError(err);
  }
  return response
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

function buildResponse(statusCode: number, body: any) {
  return {
    statusCode,
    headers: {
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify(body)
  }
}

function handleError(err: any): APIGatewayProxyResult {
  const error = err as Error // TODO: could also be a string
  logger.error(`Error creating Capstone Account. ${error.message}`)
  return buildErrorResponse(error)
}

function buildErrorResponse(error: any ) {
  const errorBody = {error: error.message}
  if (!error.statusCode) {
    return buildResponse(500, errorBody) // TODO: test me
  }
  return buildResponse(error.statusCode, errorBody)
}
