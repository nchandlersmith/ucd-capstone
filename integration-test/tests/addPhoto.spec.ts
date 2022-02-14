import {deletePhotosByUserAndPhotoIds, findAllPhotosByUserId} from "../utils/dynamoUtils";
import {AddPhotoRequest, AddPhotoDao} from "../../backend/src/models/addPhotoModels"
import {DateTime} from "luxon"

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

  it("should add photo data to db", async () => {
    const uuidLength = 36
    const uuidv4RegEx = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    const expectedAddedOn = DateTime.now().toMillis()
    const timestampDeltaTolerance = 2000

    await axios.post(photosUrl, JSON.stringify(request))

    const dynamoResponse = await findAllPhotosByUserId(userId)
    expect(dynamoResponse.Items?.length).toEqual(1)
    const actual: AddPhotoDao = dynamoResponse.Items[0]
    const actualAddedOn = DateTime.fromISO(actual.addedOn).toMillis()
    const actualTimestampDelta = Math.abs(actualAddedOn - expectedAddedOn)
    expect(actual.userId).toEqual(userId)
    expect(actual.photoId.length).toEqual(uuidLength)
    expect(actual.photoId).toMatch(uuidv4RegEx)
    expect(actual.vendorId).toEqual(request.vendor)
    expect(actual.photoLabel).toEqual(request.label)
    expect(actual.vendorService).toEqual(request.service)
    expect(actualTimestampDelta).toBeLessThan(timestampDeltaTolerance)
    expect(actual.getPhotoUrl).toContain("https://photos-707863247739-dev.s3.amazonaws.com")
    expect(actual.getPhotoUrl).toContain(actual.photoId)
    expect(actual.putPhotoUrl).toContain("https://photos-707863247739-dev.s3.amazonaws.com")
    expect(actual.putPhotoUrl).toContain(actual.photoId)
  })

  it("should reject requests with missing email address", async () => {
    const {emailAddress, ...requestWithMissingEmailAddress} = request
    const result = await axios.post(photosUrl, JSON.stringify(requestWithMissingEmailAddress)).catch((error: any) => error)

    // TODO: check the other things
    expect(result.response.status).toEqual(400)
    expect(result.response.data).toEqual({"error": "Add photo request is missing emailAddress. Request denied."})
  })
})
