import {AddPhotoRequest} from "../../models/photosModels";
import {handler} from "./addPhotoLambda";
import {buildEvent} from "../../testUtils/eventUtils";

const putSignedUrl = "https://put.com"
jest.mock("../../persistence/s3Client", () => {
  return {
    createGetSignedUrl: () => Promise.resolve(),
    createPutSignedUrl: () => Promise.resolve(putSignedUrl)
  }
})

jest.mock("../../persistence/dbClient", () => {
  return {
    insertPhoto: () => Promise.resolve()
  }
})

describe("add photo lambda responses", () => {
  const request: AddPhotoRequest = {
    emailAddress: "user@test.com",
    label: "photo label",
    service: "test package",
    vendor: "Test Vendor"
  }
  const requiredHeaders = {
    "access-control-allow-origin": "*"
  }
  const userId = 'Authorized Unit Test User'
  const headers = {Authorization: `Bearer blarg-${userId}`}

  it("should return put signed url", async () => {
    const expectedResponseBody = JSON.stringify({putPhotoSignedUrl: putSignedUrl})

    const result = await handler(buildEvent({headers, body: JSON.stringify(request)}))

    expect(result.statusCode).toEqual(201)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(expectedResponseBody)
  })

  it("should return 400 when the email address is missing", async () => {
    const {emailAddress, ...requestWithInvalidEmailAddress} = request
    const expectedBody = JSON.stringify({error: "Add photo request is missing emailAddress. Request denied."})

    const result = await handler(buildEvent({headers, body: JSON.stringify(requestWithInvalidEmailAddress)}))

    expect(result.statusCode).toEqual(400)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(expectedBody)
  })

  it("should return 400 when the label is missing", async () => {
    const {label, ...requestWithInvalidLabel} = request
    const expectedBody = JSON.stringify({error: "Add photo request is missing label. Request denied."})

    const result = await handler(buildEvent({headers, body: JSON.stringify(requestWithInvalidLabel)}))

    expect(result.statusCode).toEqual(400)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(expectedBody)
  })

  it("should return 400 when the service is missing", async () => {
    const {service, ...requestWithMissingService} = request
    const expectedBody = JSON.stringify({error: "Add photo request is missing service. Request denied."})

    const result = await handler(buildEvent({headers, body: JSON.stringify(requestWithMissingService)}))

    expect(result.statusCode).toEqual(400)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(expectedBody)
  })

  it("should return 400 when the vendor is missing", async () => {
    const {vendor, ...requestWithMissingVendor} = request
    const expectedBody = JSON.stringify({error: "Add photo request is missing vendor. Request denied."})

    const result = await handler(buildEvent({headers, body: JSON.stringify(requestWithMissingVendor)}))

    expect(result.statusCode).toEqual(400)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(expectedBody)
  })

  it("should reject requests with missing auth header", async () => {
    const expectedErrorMessage = JSON.stringify({error: "Unauthorized user"})

    const result = await handler(buildEvent({headers: {}, body: JSON.stringify(request)}))

    expect(result.statusCode).toEqual(403)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(expectedErrorMessage)
  })

  it("should reject unauthorized users", async () => {
    const userId = "Unauthorized user"
    const unauthorizedUserHeader = {Authorization: `Bearer invalid-${userId}`}
    const expectedErrorMessage = JSON.stringify({error: "Unauthorized user"})

    const result = await handler(buildEvent({headers: unauthorizedUserHeader, body: JSON.stringify(request)}))

    expect(result.statusCode).toEqual(403)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(expectedErrorMessage)
  })
})
