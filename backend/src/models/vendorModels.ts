export interface VendorDao {
  region: string,
  vendorName: string,
  vendorServices: string[]
}

export interface CreateVendorRequest {
  vendorName: string,
  vendorServices: string[]
}
