import {createVendor, getVendors} from "./vendorService";
import {ModelValidationError} from "../../exceptions/exceptions";
import {CreateVendorRequest, Vendor} from "../../models/vendorModels";
import {getAllVendors, insertVendor} from "../../persistence/dbClient";


jest.mock("../../persistence/dbClient", () => {
  return {
    insertVendor: jest.fn(),
    getAllVendors: jest.fn()
  }
})

describe("createVendorService", () => {
  it("should add country to the db call", async () => {
    const request: CreateVendorRequest = {
      vendorName: "Test Vendor",
      vendorServices: ["Test Service"]
    };
    const expectedDao: Vendor = {...request, country: "United States"}

    await createVendor(request)

    expect(insertVendor).toHaveBeenCalledWith(expectedDao)
  })

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

  it("should reject requests with null vendorName", async () => {
    const request = {vendorName: null, vendorServices: ["test service one", "service two"]}
    const errorMessageRegEx = /^Create vendor request contains an invalid vendorName. Request denied.$/

    // @ts-ignore
    await expect(async () => await createVendor(request)).rejects.toThrow(ModelValidationError)
    // @ts-ignore
    await expect(async () => await createVendor(request)).rejects.toThrow(errorMessageRegEx)
  })

  it("should reject requests with undefined vendorName", async () => {
    const request = {vendorName: undefined, vendorServices: ["test service one", "service two"]}
    const errorMessageRegEx = /^Create vendor request contains an invalid vendorName. Request denied.$/

    // @ts-ignore
    await expect(async () => await createVendor(request)).rejects.toThrow(ModelValidationError)
    // @ts-ignore
    await expect(async () => await createVendor(request)).rejects.toThrow(errorMessageRegEx)
  })

  it("should reject requests with empty vendorName", async () => {
    const request = {vendorName: "", vendorServices: ["test service one", "service two"]}
    const errorMessageRegEx = /^Create vendor request contains an invalid vendorName. Request denied.$/

    // @ts-ignore
    await expect(async () => await createVendor(request)).rejects.toThrow(ModelValidationError)
    // @ts-ignore
    await expect(async () => await createVendor(request)).rejects.toThrow(errorMessageRegEx)
  })

  it("should reject requests with null vendorServices", async () => {
    const request = {vendorName: "Test Vendor", vendorServices: null}
    const errorMessageRegEx = /^Create vendor request contains an invalid vendorServices. Request denied.$/

    // @ts-ignore
    await expect(async () => await createVendor(request)).rejects.toThrow(ModelValidationError)
    // @ts-ignore
    await expect(async () => await createVendor(request)).rejects.toThrow(errorMessageRegEx)
  })

  it("should reject requests with undefined vendorServices", async () => {
    const request = {vendorName: "Test Vendor", vendorServices: undefined}
    const errorMessageRegEx = /^Create vendor request contains an invalid vendorServices. Request denied.$/

    // @ts-ignore
    await expect(async () => await createVendor(request)).rejects.toThrow(ModelValidationError)
    // @ts-ignore
    await expect(async () => await createVendor(request)).rejects.toThrow(errorMessageRegEx)
  })

  it("should reject requests with empty vendorServices", async () => {
    const request = {vendorName: "Test Vendor", vendorServices: []}
    const errorMessageRegEx = /^Create vendor request contains an invalid vendorServices. Request denied.$/

    // @ts-ignore
    await expect(async () => await createVendor(request)).rejects.toThrow(ModelValidationError)
    // @ts-ignore
    await expect(async () => await createVendor(request)).rejects.toThrow(errorMessageRegEx)
  })
})

describe("getVendorsService", () => {
  it("should return all vendors", async () => {
    const expectedVendors: Vendor[] = [{
      country: "United States",
      vendorName: "Test Vendor",
      vendorServices: ["Test Service"]
    }];
    (getAllVendors as jest.Mock).mockImplementation(() => expectedVendors)

    const result = await getVendors()

    expect(result).toStrictEqual(expectedVendors)
  })
})
