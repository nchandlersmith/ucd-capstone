import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda"
import {createLogger} from "../../utils/logger"
import {responseBuilder} from "../../utils/responseUtils"

const logger = createLogger("addPhotoLambda")

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`Received request to add photo: ${event.body}`)
  return responseBuilder(201, {message: "Success"})
}
