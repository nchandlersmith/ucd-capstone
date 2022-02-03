import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {getAccountsByUser} from "../persistence/dbClient";
import {createLogger} from "../utils/logger";
import {authorize} from "../utils/authUtils";
import {errorResponseBuilder, responseBuilder} from "../utils/responseUtils";
import {CapstoneAccount} from "../models/getAccountsModels";

const logger = createLogger('Get Account')

export const handler = async function(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const authHeader = event.headers.Authorization
  try {
    const user = authorize(authHeader)
    const accounts = await getUserAccounts(user)
    return responseBuilder(200, {accounts})
  } catch(err) {
    logger.info(`Auth error with Authorization header: ${authHeader}`)
    const error = err as Error
    return errorResponseBuilder(error)
  }
}

async function getUserAccounts(user: string): Promise<CapstoneAccount[]> {
  const dbResult = await getAccountsByUser(user)
  return dbResult.Items as CapstoneAccount[]
}
