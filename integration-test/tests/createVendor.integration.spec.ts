import {CreateVendorRequest, VendorDao} from "../../backend/src/models/vendorModels"
import axios from "axios";
import {deleteVendorByVendorName, findAllVendors} from "../utils/dynamoUtils";

describe("create vendor db integration", () => {
  const vendorUrl = "http://localhost:3000/dev/vendors"
  const userId = "Integration Test User"
  const authHeader = {Authorization: `Bearer blarg-${userId}`}
  const vendorName = "Integrated Photos"

  beforeAll(async () => {
    await deleteVendorByVendorName(vendorName)
  })

  afterEach(async () => {
    await deleteVendorByVendorName(vendorName)
  })

  it("should add a vendor to the db", async () => {
    const request: CreateVendorRequest = {
      vendorName,
      vendorServices: ["Premium", "Value"]
    }

    const expectedVendorItem: VendorDao = {
      country: "United States",
      vendorName: request.vendorName,
      vendorServices: request.vendorServices
    }

    const result = await axios.post(vendorUrl, request, {headers: authHeader})

    const dbResult = await findAllVendors()
    expect(dbResult.Items.length).toEqual(1)
    expect(dbResult.Items[0]).toEqual(expectedVendorItem)
    expect(result.status).toEqual(201)
    expect(result.data).toStrictEqual({message: "Success"})
  })

  it("should reject requests missing vendorName", async () => {
    const result = await axios.post(vendorUrl,
      {vendorServices: ["Test Service"]},
      {headers: authHeader})
      .catch(error => error)

    const dbResult = await findAllVendors()
    expect(dbResult.Items.length).toEqual(0)
    expect(result.response.status).toEqual(400)
    expect(result.response.data).toEqual({"error": "Create vendor request is missing vendorName. Request denied."})
  })

    it("should reject requests missing vendorServices", async () => {
      const result = await axios.post(vendorUrl,
        {vendorName: "Integration Vendor"},
        {headers: authHeader})
        .catch(error => error)

      const dbResult = await findAllVendors()
      expect(dbResult.Items.length).toEqual(0)
      expect(result.response.status).toEqual(400)
      expect(result.response.data).toEqual({"error": "Create vendor request is missing vendorServices. Request denied."})
  })

  it("should reject requests missing authHeader", async () => {
    const result = await axios.post(vendorUrl,
      {vendorName: "Integration Vendor", vendorServices: ["Some Great Service"]},
      {headers: {}})
      .catch(error => error)

    const dbResult = await findAllVendors()
    expect(dbResult.Items.length).toEqual(0)
    expect(result.response.status).toEqual(403)
    expect(result.response.data).toEqual({"error": "Unauthorized user"})
  })

  it("should reject requests for unauthorized user", async () => {
    const result = await axios.post(vendorUrl,
      {vendorName: "Integration Vendor", vendorServices: ["Some Great Service"]},
      {headers: {Authorization: "Bearer unauthorized user"}})
      .catch(error => error)

    const dbResult = await findAllVendors()
    expect(dbResult.Items.length).toEqual(0)
    expect(result.response.status).toEqual(403)
    expect(result.response.data).toEqual({"error": "Unauthorized user"})
  })
})
