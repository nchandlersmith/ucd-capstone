import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {getPhotosByVendorService} from "../../services/getPhotosByVendorService/getPhootosByVendorService";
import {authorize} from "../../utils/authUtils";

export const handler = async  (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const vendor = event.pathParameters?.vendorName
  const authHeader = event.headers.Authorization
  if (authHeader === undefined) {
    return {
      statusCode: 403,
      headers: {"access-control-allow-origin": "*"},
      body: JSON.stringify({error: "Unauthorized User"})
    }
  }
  if (!authHeader.split(" ")[1].includes("blarg-")) {
    return {
      statusCode: 403,
      headers: {"access-control-allow-origin": "*"},
      body:JSON.stringify({error: "Unauthorized User"})
    }
  }
  const photos = await getPhotosByVendorService("")
  return {
    statusCode: 200,
    headers: {"access-control-allow-origin": "*"},
    body: JSON.stringify(photos)
  }
}

