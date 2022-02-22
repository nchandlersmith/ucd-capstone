import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {getPhotos} from "../../services/getPhotos/getPhotosService";
import {authorize} from "../../utils/authUtils";
import {errorResponseBuilder, responseBuilder} from "../../utils/responseUtils";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let photos
  try {
    authorize(event.headers.Authorization)
    photos = await getPhotos("unit test user")
  } catch (err) {
    const error  = err as Error
    return errorResponseBuilder(error)
  }
  return responseBuilder(201, {photos})
}
