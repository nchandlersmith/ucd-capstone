import {VendorDao} from "../../models/vendorModels";
import {getAllVendors} from "../../persistence/dbClient";
import {handler} from "./getVendorsLambda";
import {buildEvent} from "../../testUtils/eventUtils";

jest.mock("../../persistence/dbClient", () => {
  return {
    getAllVendors: jest.fn()
  }
})

describe("getVendorsLambda", () => {
  const requiredHeaders = {"access-control-allow-origin": "*"}

  it("should return vendors", async () => {
    const vendors: VendorDao[] = [{
      country: "United States",
      vendorName: "Test Vendor",
      vendorServices: ["Test Vendor Service"]
    }];
    (getAllVendors as jest.Mock).mockImplementation(() => vendors)
    const validAuthHeader = {Authorization: "Bearer blarg-valid user"}

    const result = await handler(buildEvent({headers:validAuthHeader}))

    expect(result.statusCode).toEqual(200)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toEqual(JSON.stringify(vendors))
  })

  it("should reject requests missing auth header", async () => {
    const result = await handler(buildEvent({headers: {}}))
    const expectedErrorMessage = JSON.stringify({error: "Unauthorized user"})

    expect(result.statusCode).toEqual(403)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toEqual(expectedErrorMessage)
  })

  it("should reject requests from unauthorized users", async () => {
    const result = await handler(buildEvent({headers: {Authorization: "Bearer invalid"}}))
    const expectedErrorMessage = JSON.stringify({error: "Unauthorized user"})

    expect(result.statusCode).toStrictEqual(403)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toEqual(expectedErrorMessage)
  })
});
