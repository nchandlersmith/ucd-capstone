import {getAllVendors} from "../../persistence/dbClient";
import {VendorDao} from "../../models/vendorModels";

export async function getVendors(): Promise<VendorDao[]> {
  return await getAllVendors()
}
