export interface AddPhotoRequest {
  label: string,
  vendor: string,
  service: string,
  emailAddress: string
}

// TODO: add fields: status, startedProcessing, finished, shipped ...
export interface PhotoDao {
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
