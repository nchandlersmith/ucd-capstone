import {CreateVendorRequest, VendorDao} from "../../models/vendorModels";
import {insertVendor} from "../../persistence/dbClient";

export async function createVendor(request: CreateVendorRequest): Promise<void> {
  const vendor: VendorDao = {...request, region: ""}
  await insertVendor(vendor)
}
