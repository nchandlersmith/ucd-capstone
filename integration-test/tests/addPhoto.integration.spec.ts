import {deletePhotosByUserAndPhotoIds, findAllPhotosByUserId} from "../utils/dynamoUtils";
import {AddPhotoRequest, AddPhotoDao} from "../../backend/src/models/addPhotoModels"
import {DateTime} from "luxon"

const axios = require("axios")

describe("add photo persistence", () => {
  const userId = "Ghost Rider"
  const photosUrl = "http://localhost:3000/dev/photos"
  const request: AddPhotoRequest = {
    label: "Integration Test Label",
    vendor: "Integration Vendor",
    service: "Integration Service",
    emailAddress: "test@int.com"
  }

  beforeAll(async () => {
    const dynamoResponse = await findAllPhotosByUserId(userId)
    for (const item of dynamoResponse.Items) {
      await deletePhotosByUserAndPhotoIds(item.photoId, userId)
        .catch((error: any) => console.error(`Error occurred while cleaning up dynamo${error.message}`))
    }
  })

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

    const dynamoQueryResult = await findAllPhotosByUserId(userId)
    expect(dynamoQueryResult.Items?.length).toEqual(1)
    const dbResult: AddPhotoDao = dynamoQueryResult.Items[0]
    const actualAddedOn = DateTime.fromISO(dbResult.addedOn).toMillis()
    const actualTimestampDelta = Math.abs(actualAddedOn - expectedAddedOn)
    expect(dbResult.userId).toEqual(userId)
    expect(dbResult.photoId.length).toEqual(uuidLength)
    expect(dbResult.photoId).toMatch(uuidv4RegEx)
    expect(dbResult.vendorId).toEqual(request.vendor)
    expect(dbResult.photoLabel).toEqual(request.label)
    expect(dbResult.vendorService).toEqual(request.service)
    expect(actualTimestampDelta).toBeLessThan(timestampDeltaTolerance)
    expect(dbResult.getPhotoUrl).toContain("https://photos-707863247739-dev.s3.amazonaws.com")
    expect(dbResult.getPhotoUrl).toContain(dbResult.photoId)
    expect(dbResult.putPhotoUrl).toContain("https://photos-707863247739-dev.s3.amazonaws.com")
    expect(dbResult.putPhotoUrl).toContain(dbResult.photoId)
  })

  it("should not add photo data to db when email address is missing", async () => {
    const {emailAddress, ...requestWithMissingEmailAddress} = request

    await axios.post(photosUrl, JSON.stringify(requestWithMissingEmailAddress)).catch((error: any) => error)

    const dynamoQueryResult = await findAllPhotosByUserId(userId)
    expect(dynamoQueryResult.Items.length).toEqual(0)
  })

  it("should not add photo data to db when label is missing", async () => {
    const {label, ...requestWithMissingLabel} = request

    await axios.post(photosUrl, JSON.stringify(requestWithMissingLabel)).catch((error: any) => error)

    const dynamoQueryResult = await findAllPhotosByUserId(userId)
    expect(dynamoQueryResult.Items.length).toEqual(0)
  })

  it("should not add photo data to db when vendor is missing", async () => {
    const {vendor, ...requestWithMissingVendor} = request

    await axios.post(photosUrl, JSON.stringify(requestWithMissingVendor)).catch((error: any) => error)

    const dynamoQueryResult = await findAllPhotosByUserId(userId)
    expect(dynamoQueryResult.Items.length).toEqual(0)
  })

  it("should not add photo data to db when service is missing", async () => {
    const {service, ...requestWithMissingService} = request

    await axios.post(photosUrl, JSON.stringify(requestWithMissingService)).catch((error: any) => error)

    const dynamoQueryResult = await findAllPhotosByUserId(userId)
    expect(dynamoQueryResult.Items.length).toEqual(0)
  })
})
