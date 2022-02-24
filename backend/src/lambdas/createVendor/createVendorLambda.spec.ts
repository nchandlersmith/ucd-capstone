import {CreateVendorRequest} from "../../models/vendorModels";
import {buildEvent} from "../../testUtils/eventUtils";
import {handler} from "./createVendorLambda";

describe("createVendorLambda", () => {
  const requiredHeaders = {
    "access-control-allow-origin": "*"
  }
  it("should return success", async () => {
    const request: CreateVendorRequest = {
      vendorName: "unit test vendor",
      vendorServices: ["Premium", "Value", "Black and White"]
    }
    const expectedBody = {message: "Success"}

    const result = await handler(buildEvent({body: JSON.stringify(request)}))

    expect(result.statusCode).toEqual(201)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(JSON.stringify(expectedBody))
  })
})
