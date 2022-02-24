import {CreateVendorRequest, VendorDao} from "../../models/vendorModels";
import {insertVendor} from "../../persistence/dbClient";
import {createLogger} from "../../utils/logger";
import {ModelValidationError} from "../../exceptions/exceptions";

const logger = createLogger("createVendorService")
const requiredFields = ["vendorName", "vendorServices"] as (keyof CreateVendorRequest)[]

export async function createVendor(request: CreateVendorRequest): Promise<void> {
  logger.info(`Received request to create vendor ${JSON.stringify(request)}`)
  validateRequestFields(request);

  if (!request.vendorName) {
    throw new ModelValidationError('Create vendor request contains an invalid vendorName. Request denied.')
  }

  const vendor: VendorDao = {...request, country: "United States"}
  await insertVendor(vendor)
}

function validateRequestFields(request: CreateVendorRequest) {
  requiredFields.forEach((field) => {
    if (!Object.keys(request).includes(field)) {
      throw new ModelValidationError(`Create vendor request is missing ${field}. Request denied.`)
    }
  })
}
