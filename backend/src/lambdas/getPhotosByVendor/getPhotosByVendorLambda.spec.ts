import {getPhotosByVendor} from "../../persistence/dbClient";
import {PhotoByVendor} from "../../models/photosModels";
import {handler} from "./getPhotosByVendorLambda";
import {buildEvent} from "../../testUtils/eventUtils";
import {APIGatewayProxyEventPathParameters} from "aws-lambda";
import {getVendors} from "../../services/vendorService/vendorService";
import {Vendor} from "../../models/vendorModels";

jest.mock("../../persistence/dbClient", () => {
  return {
    getPhotosByVendor: jest.fn()
  }
})

jest.mock("../../services/vendorService/vendorService", () => {
  return {
    getVendors: jest.fn()
  }
})

describe("getPhotosByVendorLambda", () => {
  const requiredHeaders = {
    "access-control-allow-origin": "*"
  }

  it("should return photos for specified vendor", async () => {
    const vendorName = "some vendor"
    const allVendors: Vendor[] = [{
      vendorName,
      vendorServices: ["does not matter"],
      country: ""
    }]
    const userId = "test user"
    const authHeader = {Authorization: `Bearer blarg-${userId}`}
    const pathParameters: APIGatewayProxyEventPathParameters = {vendorName}
    const expectedPhotos:PhotoByVendor[] = [{
      vendorName: "Some Vendor",
      vendorService: "Some service",
      photoId: "some photo id",
      getPhotoUrl: "https://getMyPhoto.com",
      addedOn: "some date"
    }]
    ;(getPhotosByVendor as jest.Mock).mockImplementation(() => Promise.resolve(expectedPhotos))
    ;(getVendors as jest.Mock).mockImplementation(() => Promise.resolve(allVendors))

    const result = await handler(buildEvent({headers: authHeader, pathParameters}))

    expect(result.statusCode).toEqual(200)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(JSON.stringify({photos: expectedPhotos}))
  })

  it("should reject requests missing auth header", async () => {
    const expectedErrorMessage = "Unauthorized user"

    const result = await handler(buildEvent())

    expect(result.statusCode).toEqual(403)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(JSON.stringify({error: expectedErrorMessage}))
  })

  it("should reject request from unauthorized user", async () => {
    const expectedErrorMessage = "Unauthorized user"
    const authHeader = {Authorization: "Bearer invalid user"}

    const result = await handler(buildEvent({headers: authHeader}))

    expect(result.statusCode).toEqual(403)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(JSON.stringify({error: expectedErrorMessage}))
  })

  //TODO: returns 404 when the vendor is not found
})
