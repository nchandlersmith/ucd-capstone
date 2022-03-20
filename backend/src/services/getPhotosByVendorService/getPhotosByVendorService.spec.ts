import {getPhotosByVendor} from "../../persistence/dbClient";
import {getPhotosByVendorService} from "./getPhootosByVendorService";
import {ModelValidationError} from "../../exceptions/exceptions";

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

  it("should throw an error when the vendor name is null", async () => {
    const vendorName = null
    // @ts-ignore
    await (expect(async () => await getPhotosByVendorService(vendorName))).rejects.toThrow(ModelValidationError)
    // @ts-ignore
    await (expect(async () => await getPhotosByVendorService(vendorName))).rejects.toThrow(/^Vendor name is invalid. Request rejected.$/)
  })

  it("should throw an error when the vendor name is undefined", async () => {
    const vendorName = undefined
    // @ts-ignore
    await (expect(async () => await getPhotosByVendorService(vendorName))).rejects.toThrow(ModelValidationError)
    // @ts-ignore
    await (expect(async () => await getPhotosByVendorService(vendorName))).rejects.toThrow(/^Vendor name is invalid. Request rejected.$/)
  })

  it("should throw an error when the vendor name is empty", async () => {
    const vendorName = ""
    // @ts-ignore
    await (expect(async () => await getPhotosByVendorService(vendorName))).rejects.toThrow(ModelValidationError)
    // @ts-ignore
    await (expect(async () => await getPhotosByVendorService(vendorName))).rejects.toThrow(/^Vendor name is invalid. Request rejected.$/)
  })
})
