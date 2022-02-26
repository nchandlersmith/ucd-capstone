import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {getVendors} from "../../services/vendorService/vendorService";
import {authorize} from "../../utils/authUtils";
import {errorResponseBuilder, responseBuilder} from "../../utils/responseUtils";
import {createLogger} from "../../utils/logger";

const logger = createLogger("getVendorsLambda")

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let vendors
  try {
    authorize(event.headers.Authorization)
    vendors = await getVendors()
  } catch(error) {
    logger.error(`Error while getting vendors ${JSON.stringify(error)}`)
    return errorResponseBuilder(error as Error)
  }

  return responseBuilder(200, vendors)
}
