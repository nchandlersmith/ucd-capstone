import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {responseBuilder} from "../../utils/responseUtils";


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return responseBuilder(201, {message: "Success"})
}
