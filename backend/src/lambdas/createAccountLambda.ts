import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateCapstoneAccountRequest } from '../models/createAccountModels'
import {storeCapstoneAccount} from '../persistence/dbClient'
import { createLogger } from '../utils/logger'
import {authorize} from "../utils/authUtils";
import {buildCreateCapstoneAccountItem, validateCreateCapstoneAccountRequest} from "../services/createAccountService";
import {errorResponseBuilder, responseBuilder} from "../utils/responseUtils";

const logger = createLogger('Create Account')

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Received request to create account.')
  const request: CreateCapstoneAccountRequest = event.body ? JSON.parse(event.body) : {}
  const authHeader = event.headers.Authorization

  let response: APIGatewayProxyResult;
  try {
    const userId = authorize(authHeader)
    await createCapstoneAccount(request, userId)
    response = responseBuilder(201, {message: 'Success'})
  } catch(err: unknown) {
    const error = err as Error
    response = errorResponseBuilder(error);
  }
  return response
}

async function createCapstoneAccount(request: CreateCapstoneAccountRequest, userId: string) {
  validateCreateCapstoneAccountRequest(request)
  storeCapstoneAccount(buildCreateCapstoneAccountItem(request, userId))
}

