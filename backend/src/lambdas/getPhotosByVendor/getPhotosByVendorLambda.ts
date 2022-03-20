import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {getPhotosByVendorService} from "../../services/getPhotosByVendorService/getPhootosByVendorService";
import {authorize} from "../../utils/authUtils";
import {errorResponseBuilder, responseBuilder} from "../../utils/responseUtils";
import {createLogger} from "../../utils/logger";

const logger = createLogger("getPhotosByVendorLambda")

export const handler = async  (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let photos
  try {
    const vendor = event.pathParameters?.vendorName
    logger.info(`Getting photos for vendor ${vendor}`)
    authorize(event.headers.Authorization)
    photos = await getPhotosByVendorService("")
  } catch (error) {
    logger.error(error)
    return errorResponseBuilder(error as Error)
  }
  return responseBuilder(200, {photos})
}

