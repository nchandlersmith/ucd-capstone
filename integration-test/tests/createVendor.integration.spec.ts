import {CreateVendorRequest} from "../../backend/src/models/vendorModels"
import axios from "axios";

describe("create vendor db integration", () => {
  const vendorUrl = "http://localhost:3000/dev/vendors"
  const userId = "Integration Test User"
  const authHeader = {Authorization: `Bearer blarg-${userId}`}

  it("should add a vendor to the db", async () => {
    const request: CreateVendorRequest = {
      vendorName: "Integrated Photos",
      vendorServices: ["Premium", "Value"]
    }

    const result = await axios.post(vendorUrl, request, {headers: authHeader})

    expect(result.status).toEqual(201)
    expect(result.data).toStrictEqual({message: "Success"})
  })
})
