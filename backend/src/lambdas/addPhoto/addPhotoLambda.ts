import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda"
import {createLogger} from "../../utils/logger"
import {errorResponseBuilder, responseBuilder} from "../../utils/responseUtils"
import {addPhoto} from "../../services/addPhoto/addPhotoService";

const logger = createLogger("addPhotoLambda")

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`Received add photo request ${event.body}.`)

  let putPhotoSignedUrl
  try {
    const request = event.body ? JSON.parse(event.body) : {}
    putPhotoSignedUrl = await addPhoto(request, "Ghost Rider")
  } catch(err: any) {
    const error  = err as Error
    return errorResponseBuilder(error)
  }
  return responseBuilder(201, {putPhotoSignedUrl})
}
