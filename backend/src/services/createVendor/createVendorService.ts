import {CreateVendorRequest, VendorDao} from "../../models/vendorModels";
import {insertVendor} from "../../persistence/dbClient";
import {createLogger} from "../../utils/logger";
import {ModelValidationError} from "../../exceptions/exceptions";

const logger = createLogger("createVendorService")

export async function createVendor(request: CreateVendorRequest): Promise<void> {
  logger.info(`Received request to create vendor ${JSON.stringify(request)}`)

  if (!Object.keys(request).includes("vendorName")) {
    throw new ModelValidationError("Create vendor request is missing vendorName. Request denied.")
  }
  if (!Object.keys(request).includes("vendorServices")) {
    throw new ModelValidationError("Create vendor request is missing vendorServices. Request denied.")
  }

  const vendor: VendorDao = {...request, country: "United States"}
  await insertVendor(vendor)
}
