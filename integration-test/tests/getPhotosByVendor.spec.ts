import {PhotoData} from "../../backend/src/models/photosModels"
import {putPhoto, putVendor} from "../utils/dynamoUtils";
import {Vendor} from "../../backend/src/models/vendorModels"
import axios from "axios";

describe("get photos by vendor", () => {
  const vendorName = "Integrated Test Vendor"
  const photosUrl = `http://localhost:3000/dev/photos/${vendorName}`
  const userId = "Some User"
  const myVendorPhoto: PhotoData = {
    addedOn: "some day",
    getPhotoUrl: "https://getThePhotos.io",
    photoId: "some photo id",
    photoLabel: "Label",
    putPhotoUrl: "https://putThePhotos.io",
    vendorId: vendorName,
    vendorService: "Premium",
    userId
  }
  const otherVendorPhoto: PhotoData = {
    addedOn: "some day",
    getPhotoUrl: "https://getThePhotos.io",
    photoId: "some photo id",
    photoLabel: "",
    putPhotoUrl: "https://putThePhotos.io",
    vendorId: vendorName,
    vendorService: "Premium",
    userId
  }
  const vendor: Vendor = {
    country: "United States",
    vendorName,
    vendorServices: ["Premium", "Value"]
  }

  it("should return all photos for specified vendor", async () => {
    await putPhoto(myVendorPhoto)
    await putPhoto(otherVendorPhoto)
    await putVendor(vendor)

    const result = await axios.get(photosUrl, {headers: {Authorization: `Bearer blarg-${userId}`}})

    expect(result.status).toEqual(200)
  })
})
