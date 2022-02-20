import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda"
import {createLogger} from "../../utils/logger"
import {errorResponseBuilder, responseBuilder} from "../../utils/responseUtils"
import {addPhoto} from "../../services/addPhoto/addPhotoService";
import {authorize} from "../../utils/authUtils";

const logger = createLogger("addPhotoLambda")

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`Received add photo request ${event.body}.`)

  let putPhotoSignedUrl
  try {
    const request = event.body ? JSON.parse(event.body) : {}
    const userId = authorize(event.headers.Authorization)
    putPhotoSignedUrl = await addPhoto(request, userId)
  } catch(err: any) {
    const error  = err as Error
    return errorResponseBuilder(error)
  }
  return responseBuilder(201, {putPhotoSignedUrl})
}
