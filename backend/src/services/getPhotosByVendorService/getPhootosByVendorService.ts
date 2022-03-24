import {PhotoByVendor} from "../../models/photosModels";
import {getPhotosByVendor} from "../../persistence/dbClient";
import {EntityNotFoundError, ModelValidationError} from "../../exceptions/exceptions";
import {getVendors} from "../vendorService/vendorService";
import {Vendor} from "../../models/vendorModels";
import {createLogger} from "../../utils/logger";

const logger = createLogger("getPhotosByVendorService")

export async function getPhotosByVendorService(vendorName: string): Promise<PhotoByVendor[]> {
  validateVendorName(vendorName)
  const vendors = await getVendors()
  verifyVendorExists(vendors, vendorName);
  return await getPhotosByVendor(vendorName)
}

function validateVendorName(vendorName: string) {
  if (!vendorName) {
    logger.error("Vendor name is invalid. Request rejected.")
    throw new ModelValidationError("Vendor name is invalid. Request rejected.")
  }
}

function verifyVendorExists(vendors: Vendor[], vendorName: string) {
  if (!(vendors.map(vendor => vendor.vendorName).includes(vendorName))) {
    logger.error(`Vendor not found by name ${vendorName}. Request rejected.`)
    throw new EntityNotFoundError(`Vendor not found with name ${vendorName}. Request rejected.`)
  }
}
