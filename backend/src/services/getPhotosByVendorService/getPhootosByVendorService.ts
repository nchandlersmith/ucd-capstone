import {PhotoByVendor} from "../../models/photosModels";
import {getPhotosByVendor} from "../../persistence/dbClient";

export async function getPhotosByVendorService(vendorName: string): Promise<PhotoByVendor[]> {
  return await getPhotosByVendor(vendorName)
}
