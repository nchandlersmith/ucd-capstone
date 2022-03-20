import {getPhotosByVendor} from "../../persistence/dbClient";
import {PhotoByVendor} from "../../models/photosModels";
import {handler} from "./getPhotosByVendorLambda";
import {buildEvent} from "../../testUtils/eventUtils";

jest.mock("../../persistence/dbClient", () => {
  return {
    getPhotosByVendor: jest.fn()
  }
})

describe("getPhotosByVendorLambda", () => {
  const requiredHeaders = {
    "access-control-allow-origin": "*"
  }

  it("should return photos for specified vendor", async () => {
    const userId = "test user"
    const authHeader = {Authorization: `Bearer blarg-${userId}`}
    const expectedPhotos:PhotoByVendor[] = [{
      vendorName: "Some Vendor",
      vendorService: "Some service",
      photoId: "some photo id",
      getPhotoUrl: "https://getMyPhoto.com",
      addedOn: "some date"
    }];
    (getPhotosByVendor as jest.Mock).mockImplementation(() => Promise.resolve(expectedPhotos))

    const result = await handler(buildEvent({headers: authHeader}))

    expect(result.statusCode).toEqual(200)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(JSON.stringify(expectedPhotos))
  })

  it("should reject requests missing auth header", async () => {
    const expectedErrorMessage = "Unauthorized User"

    const result = await handler(buildEvent())

    expect(result.statusCode).toEqual(403)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(JSON.stringify({error: expectedErrorMessage}))
  })

  it("should reject request from unauthorized user", async () => {
    const expectedErrorMessage = "Unauthorized User"
    const authHeader = {Authorization: "Bearer invalid user"}

    const result = await handler(buildEvent({headers: authHeader}))

    expect(result.statusCode).toEqual(403)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(JSON.stringify({error: expectedErrorMessage}))
  })
})
