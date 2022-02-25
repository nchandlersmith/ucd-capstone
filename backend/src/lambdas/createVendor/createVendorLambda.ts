import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {errorResponseBuilder, responseBuilder} from "../../utils/responseUtils";
import {createVendor} from "../../services/createVendor/createVendorService";
import {createLogger} from "../../utils/logger";
import {CreateVendorRequest} from "../../models/vendorModels";

const logger = createLogger("createVendorLambda")


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Received request to create a vendor.")
  try {
    const request: CreateVendorRequest = JSON.parse(event.body ? event.body : "")
    await createVendor(request)
  } catch (err) {
    const error = err as Error
    return errorResponseBuilder(error)
  }
  return responseBuilder(201, {message: "Success"})
}
