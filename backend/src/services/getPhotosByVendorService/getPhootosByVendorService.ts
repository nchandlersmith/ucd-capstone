import {PhotoByVendor} from "../../models/photosModels";
import {getPhotosByVendor} from "../../persistence/dbClient";
import {ModelValidationError} from "../../exceptions/exceptions";

export async function getPhotosByVendorService(vendorName: string): Promise<PhotoByVendor[]> {
  if (!vendorName) {
    throw new ModelValidationError("Vendor name is invalid. Request rejected.")
  }
  return await getPhotosByVendor(vendorName)
}
