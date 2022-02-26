import {VendorDao} from "../../models/vendorModels";
import {getAllVendors} from "../../persistence/dbClient";
import {getVendors} from "./getVendorsService";

jest.mock("../../persistence/dbClient", () => {
  return {
    getAllVendors: jest.fn()
  }
})

describe("getVendorsService", () => {
  it("should return all vendors", async () => {
    const expectedVendors: VendorDao[] = [{
      country: "United States",
      vendorName: "Test Vendor",
      vendorServices: ["Test Service"]
    }];
    (getAllVendors as jest.Mock).mockImplementation(() => expectedVendors)

    const result = await getVendors()

    expect(result).toStrictEqual(expectedVendors)
  })
})
