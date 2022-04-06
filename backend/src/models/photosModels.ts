export interface AddPhotoRequest {
  label: string,
  vendor: string,
  service: string,
  emailAddress: string
}

export interface PhotoData {
  userId: string,
  photoId: string,
  vendorId: string,
  photoLabel: string,
  vendorService: string,
  addedOn: string,
  getPhotoUrl: string,
  putPhotoUrl: string
}
// TODO delete me
export interface AddPhotoResponse {
  putPhotoUrl: string,
  addedOn: string
}
// TODO: delete me
export interface PhotoPackage {
  userId: string,
  photoId: string,
  vendorId: string,
  photoLabel: string,
  vendorService: string,
  addedOn: string,
  getPhotoUrl: string,
  putPhotoUrl: string
}

export interface PhotoByVendor {
  userId: string,
  photoId: string,
  vendorId: string,
  getPhotoUrl: string
  vendorService: string,
  addedOn: string,
  photoLabel: string
}
