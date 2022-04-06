import {PhotoByVendor, PhotoData} from "../../backend/src/models/photosModels"
import {
  deleteAllPhotosByUser,
  deleteVendorByVendorName,
  putPhoto,
  putVendor
} from "../utils/dynamoUtils";
import {Vendor} from "../../backend/src/models/vendorModels"
import axios from "axios";

describe("get photos by vendor", () => {
  const vendorName = "Integrated Test Vendor"
  const photosUrl = `http://localhost:3000/dev/photos/${vendorName}`
  const userId = "Some User"
  const addedOn = "Some timestamp"
  const getPhotoUrl = "https://getThePhotos.io"
  const photoId = "some photo id"
  const vendorService = "Premium"
  const photoLabel = "Label"

  const myVendorPhoto: PhotoData = {
    addedOn,
    getPhotoUrl,
    photoId,
    photoLabel,
    putPhotoUrl: "https://putThePhotos.io",
    vendorId: vendorName,
    vendorService,
    userId
  }

  const vendor: Vendor = {
    country: "United States",
    vendorName,
    vendorServices: ["Premium", "Value"]
  }
  const expectedPhoto: PhotoByVendor = {
    userId,
    vendorId: vendorName,
    photoId,
    getPhotoUrl,
    addedOn,
    vendorService,
    photoLabel
  }

  beforeAll(async () => {
    await deleteAllPhotosByUser(userId)
    await deleteVendorByVendorName(vendorName)
  })

  afterEach(async () => {
    await deleteAllPhotosByUser(userId)
    await deleteVendorByVendorName(vendorName)
  })

  it("should return all photos for specified vendor", async () => {
    await putPhoto(myVendorPhoto)
    await putVendor(vendor)

    const result = await axios.get(photosUrl, {headers: {Authorization: `Bearer blarg-${userId}`}})

    expect(result.status).toEqual(200)
    expect(result.data).toStrictEqual({photos: [expectedPhoto]})
  })
})
