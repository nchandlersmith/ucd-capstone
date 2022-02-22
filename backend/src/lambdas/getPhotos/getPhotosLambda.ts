import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {getPhotos} from "../../services/getPhotos/getPhotosService";
import {authorize} from "../../utils/authUtils";
import {errorResponseBuilder, responseBuilder} from "../../utils/responseUtils";
import {createLogger} from "../../utils/logger";

const logger = createLogger("getPhotosLambda.handler")

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let photos
  try {
    const user = authorize(event.headers.Authorization)
    logger.info(`Received request to get photos for ${user}`)
    photos = await getPhotos(user)
    logger.info(`Found ${photos.length} photos`)
  } catch (err) {
    const error  = err as Error
    return errorResponseBuilder(error)
  }
  return responseBuilder(201, {photos})
}
