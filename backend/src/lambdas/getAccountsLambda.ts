import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {getAccountsByUser} from "../persistence/dbClient";
import {createLogger} from "../utils/logger";
import {authorize} from "../utils/authUtils";
import {errorResponseBuilder, responseBuilder} from "../utils/responseUtils";

const logger = createLogger('Get Account')

export const handler = async function(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const authHeader = event.headers.Authorization
  try {
    const user = authorize(authHeader)
    const dbResult = await getAccountsByUser(user)
    return responseBuilder(200, {accounts: dbResult.Items})
  } catch(err) {
    logger.info(`Auth error with Authorization header: ${authHeader}`)
    const error = err as Error
    return errorResponseBuilder(error)
  }
}
