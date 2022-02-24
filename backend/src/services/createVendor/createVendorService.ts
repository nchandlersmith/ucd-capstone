import {CreateVendorRequest, VendorDao} from "../../models/vendorModels";
import {insertVendor} from "../../persistence/dbClient";
import {createLogger} from "../../utils/logger";

const logger = createLogger("createVendorService")

export async function createVendor(request: CreateVendorRequest): Promise<void> {
  logger.info(`Received request to create vendor ${JSON.stringify(request)}`)
  const vendor: VendorDao = {...request, country: "United States"}
  await insertVendor(vendor)
}
