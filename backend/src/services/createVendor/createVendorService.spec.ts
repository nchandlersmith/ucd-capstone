import {createVendor} from "./createVendorService";
import {ModelValidationError} from "../../exceptions/exceptions";


jest.mock("../../persistence/dbClient", () => {
  return {
    insertVendor: jest.fn()
  }
})

describe("createVendorService", () => {
  it("should reject requests without a vendorName", async () => {
    const requestWithoutVendorName = {vendorServices: ["Service One"]}
    const errorMessageRegEx = /^Create vendor request is missing vendorName. Request denied.$/

    // @ts-ignore
    await expect(async () => await createVendor(requestWithoutVendorName)).rejects.toThrow(ModelValidationError)
    // @ts-ignore
    await expect(async () => await createVendor(requestWithoutVendorName)).rejects.toThrow(errorMessageRegEx)
  })

  it("should reject request without a vendorService", async () => {
    const requestWithoutVendorServices = {vendorName: "Test Vendor"}
    const errorMessageRegEx = /^Create vendor request is missing vendorServices. Request denied.$/

    // @ts-ignore
    await expect(async () => await createVendor(requestWithoutVendorServices)).rejects.toThrow(ModelValidationError)
    // @ts-ignore
    await expect(async () => await createVendor(requestWithoutVendorServices)).rejects.toThrow(errorMessageRegEx)
  })
})
