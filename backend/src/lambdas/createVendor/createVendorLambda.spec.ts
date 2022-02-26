import {CreateVendorRequest} from "../../models/vendorModels";
import {buildEvent} from "../../testUtils/eventUtils";
import {handler} from "./createVendorLambda";

jest.mock("../../persistence/dbClient", () => {
  return {
    insertVendor: jest.fn()
  }
})

describe("createVendorLambda", () => {
  const requiredHeaders = {
    "access-control-allow-origin": "*"
  }
  const validAuthHeader = {Authorization: "Bearer blarg-some user"}

  it("should return success", async () => {
    const request: CreateVendorRequest = {
      vendorName: "unit test vendor",
      vendorServices: ["Premium", "Value", "Black and White"]
    }
    const expectedBody = {message: "Success"}

    const result = await handler(buildEvent({headers: validAuthHeader, body: JSON.stringify(request)}))

    expect(result.statusCode).toEqual(201)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(JSON.stringify(expectedBody))
  })

  it("should return 400 when the vendorName is invalid", async () => {
    // @ts-ignore
    const request: CreateVendorRequest = {vendorServices: ["some services"]}
    const expectedResponseBody = {error: "Create vendor request is missing vendorName. Request denied."}

    const result = await handler(buildEvent({headers: validAuthHeader, body: JSON.stringify(request)}))

    expect(result.statusCode).toEqual(400)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(JSON.stringify(expectedResponseBody))
  })

  it("should return 400 when the vendorService is invalid", async () => {
    // @ts-ignore
    const request: CreateVendorRequest = {vendorName: "Some Vendor"}
    const expectedResponseBody = {error: "Create vendor request is missing vendorServices. Request denied."}

    const result = await handler(buildEvent({headers: validAuthHeader, body: JSON.stringify(request)}))

    expect(result.statusCode).toEqual(400)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(JSON.stringify(expectedResponseBody))
  })

  it("should return 403 when the user is unauthorized", async () => {
    const invalidAuthHeader = {Authorization: "Bearer "}
    const request: CreateVendorRequest = {
      vendorName: "Test Vendor",
      vendorServices: ["Premium", "Base"]
    }
    const expectedResponseBody = JSON.stringify({error: "Unauthorized user"})

    const result = await handler(buildEvent({headers: invalidAuthHeader, body: JSON.stringify(request)}))

    expect(result.statusCode).toEqual(403)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toEqual(expectedResponseBody)
  })
})
