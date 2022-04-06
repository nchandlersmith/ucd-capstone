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

export interface AddPhotoResponse {
  putPhotoUrl: string,
  addedOn: string
}

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
  vendorId: string,
  photoId: string,
  getPhotoUrl: string
  vendorService: string,
  addedOn: string,
  photoLabel: string
}
