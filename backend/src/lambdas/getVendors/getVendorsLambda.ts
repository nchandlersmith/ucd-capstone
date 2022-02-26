import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {getVendors} from "../../services/vendorService/vendorService";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  return {
    statusCode: 200,
    headers: {"access-control-allow-origin": "*"},
    body: JSON.stringify(await getVendors())
  }
}
