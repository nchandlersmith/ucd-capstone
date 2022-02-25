import {CreateVendorRequest, VendorDao} from "../../models/vendorModels";
import {insertVendor} from "../../persistence/dbClient";
import {createLogger} from "../../utils/logger";
import {ModelValidationError} from "../../exceptions/exceptions";

const logger = createLogger("createVendorService")
const requiredFields = ["vendorName", "vendorServices"] as (keyof CreateVendorRequest)[]

export async function createVendor(request: CreateVendorRequest): Promise<void> {
  logger.info(`Received request to create vendor ${JSON.stringify(request)}`)
  validateRequestFields(request);
  validateFieldsPopulated(request)

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

function validateFieldsPopulated(request: CreateVendorRequest) {
  requiredFields.forEach(field => {
    if (!request[field]) {
      throw new ModelValidationError(`Create vendor request contains an invalid ${field}. Request denied.`)
    }
  })
  if (request.vendorServices.length === 0) {
      throw new ModelValidationError(`Create vendor request contains an invalid vendorServices. Request denied.`)
  }
}
