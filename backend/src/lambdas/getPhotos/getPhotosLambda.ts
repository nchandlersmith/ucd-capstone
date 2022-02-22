import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {getPhotos} from "../../services/getPhotos/getPhotosService";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const photos = await getPhotos("unit test user")
  return {
    statusCode: 201,
    headers: {"access-control-allow-origin": "*"},
    body: JSON.stringify({photos: photos})

  }
}
