import {getPhotosByVendor} from "../../persistence/dbClient";
import {PhotoByVendor} from "../../models/photosModels";
import {handler} from "./getPhotosByVendorLambda";
import {buildEvent} from "../../testUtils/eventUtils";

jest.mock("dbClient", () => {
  return {
    getPhotosByVendor: jest.fn()
  }
})

describe("getPhotosByVendorLambda", () => {
  it("should return photos for specified vendor", async () => {
    const expectedPhotos:PhotoByVendor[] = [{
      vendorName: "Some Vendor",
      vendorService: "Some service",
      photoId: "some photo id",
      getPhotoUrl: "https://getMyPhoto.com",
      addedOn: "some date"
    }];
    (getPhotosByVendor as jest.Mock).mockImplementation(() => Promise.resolve(expectedPhotos))

    const result = await handler(buildEvent())
  })
})
