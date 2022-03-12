import {Vendor} from "../../backend/src/models/vendorModels"
import {deleteVendorByVendorName, putVendor} from "../utils/dynamoUtils";
import axios from "axios";

describe("getVendors", () => {
  const vendorUrl = "http://localhost:3000/dev/vendors"
  const headers = {Authorization: "Bearer blarg-valid user"}
  const vendorName = "Integrated Vendor"

  beforeAll(() => {
    deleteVendorByVendorName(vendorName)
  })

  afterEach(() => {
    deleteVendorByVendorName(vendorName)
  })

  it("should return all the vendors", async () => {
    const vendor: Vendor = {
      country: "United States",
      vendorName,
      vendorServices: ["The One Package"]
    }
    await putVendor(vendor)

    const result = await axios.get(vendorUrl, {headers})

    expect(result.status).toEqual(200)
    expect(result.data).toStrictEqual([vendor])
  })

  it("should reject requests missing authHeader", async () => {
    const result = await axios.get(vendorUrl, {headers: {}}).catch(error => error)

    expect(result.response.status).toEqual(403)
    expect(result.response.data).toEqual({"error": "Unauthorized user"})
  })

  it("should reject requests for unauthorized user", async () => {
    const result = await axios.get(vendorUrl, {headers: {Authorization: "Bearer invalid"}}).catch(error => error)

    expect(result.response.status).toEqual(403)
    expect(result.response.data).toEqual({"error": "Unauthorized user"})
  })
})
