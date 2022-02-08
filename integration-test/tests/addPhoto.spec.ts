import {deletePhotosByUserAndPhotoIds, findAllPhotosByUserId} from "../utils/dynamoUtils";
import {AddPhotoRequest} from "../../backend/src/models/addPhotoModels"

const axios = require("axios")

describe("add photo", () => {
  const userId = "Integration Test User"
  const photosUrl = "http://localhost:3000/dev/photos"

  afterEach(async () => {
    const dynamoResponse = await findAllPhotosByUserId(userId)
    for (const item of dynamoResponse.Items) {
      await deletePhotosByUserAndPhotoIds(item.photoId, userId)
        .catch((error: any) => console.error(`Error occurred while cleaning up dynamo${error.message}`))
    }
  })
  it("should create an account", async () => {
    const photoData: AddPhotoRequest = {
      label: "Integration Test Label",
      vendor: "Integration Vendor",
      service: "Integration Service",
      emailAddress: "test@int.com"
    }

    const result = await axios.post(photosUrl, JSON.stringify(photoData))

    const dynamoResponse = await findAllPhotosByUserId(userId)

    expect(result.status).toEqual(201)
    expect(dynamoResponse.Items.length).toEqual(1)
  })
})
