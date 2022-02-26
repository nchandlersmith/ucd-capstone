import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {errorResponseBuilder, responseBuilder} from "../../utils/responseUtils";
import {createVendor} from "../../services/createVendor/createVendorService";
import {createLogger} from "../../utils/logger";
import {CreateVendorRequest} from "../../models/vendorModels";
import {authorize} from "../../utils/authUtils";

const logger = createLogger("createVendorLambda")


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Received request to create a vendor.")
  try {
    authorize(event.headers.Authorization)
    const request: CreateVendorRequest = JSON.parse(event.body || "")
    await createVendor(request)
  } catch (err) {
    const error = err as Error
    return errorResponseBuilder(error)
  }
  return responseBuilder(201, {message: "Success"})
}
