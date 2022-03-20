import {getPhotosByVendor} from "../../persistence/dbClient";
import {getPhotosByVendorService} from "./getPhootosByVendorService";

jest.mock("../../persistence/dbClient", () => {
  return {
    getPhotosByVendor: jest.fn()
  }
})

describe("getPhotosByVendorService", () => {
  it("should return some fields from PhotoData",async () => {
    const vendorName = "Some Vendor"
    const expectedPhotos = {
      vendorName,
      photoId: "some photo",
      getPhotoUrl: "https://getPhotoUrl",
      vendorService: "some service",
      addedOn: "some date"
    };
    (getPhotosByVendor as jest.Mock).mockImplementation(() => Promise.resolve(expectedPhotos))

    const actualPhotos = await getPhotosByVendorService(vendorName)

    expect(expectedPhotos).toStrictEqual(actualPhotos)
  })
})
