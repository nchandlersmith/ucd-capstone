import {deletePhotosByUserAndPhotoIds, findAllPhotosByUserId} from "../utils/dynamoUtils";
import {AddPhotoRequest} from "../../backend/src/models/addPhotoModels"

const axios = require("axios")

describe("add photo", () => {
  const userId = "Ghost Rider"
  const photosUrl = "http://localhost:3000/dev/photos"
  const request: AddPhotoRequest = {
    label: "Integration Test Label",
    vendor: "Integration Vendor",
    service: "Integration Service",
    emailAddress: "test@int.com"
  }

  afterEach(async () => {
    const dynamoResponse = await findAllPhotosByUserId(userId)
    for (const item of dynamoResponse.Items) {
      await deletePhotosByUserAndPhotoIds(item.photoId, userId)
        .catch((error: any) => console.error(`Error occurred while cleaning up dynamo${error.message}`))
    }
  })
  it("should reject requests with missing email address", async () => {
    const {emailAddress, ...requestWithMissingEmailAddress} = request
    const result = await axios.post(photosUrl, JSON.stringify(requestWithMissingEmailAddress))

    expect(result.status).toEqual(400)
  })
})
