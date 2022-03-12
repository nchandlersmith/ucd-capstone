export interface Vendor  {
  country: string,
  vendorName: string,
  vendorServices: string[]
}

export interface CreateVendorRequest {
  vendorName: string,
  vendorServices: string[]
}
