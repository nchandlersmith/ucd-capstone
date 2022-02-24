import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {responseBuilder} from "../../utils/responseUtils";
import {createVendor} from "../../services/createVendor/createVendorService";
import {createLogger} from "../../utils/logger";

const logger = createLogger("createVendorLambda")


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Received request to create a vendor.")
  await createVendor(JSON.parse(event.body ? event.body : ""))
  return responseBuilder(201, {message: "Success"})
}
