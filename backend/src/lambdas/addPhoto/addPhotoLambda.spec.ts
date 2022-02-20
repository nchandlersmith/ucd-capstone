import {AddPhotoRequest} from "../../models/addPhotoModels";
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

describe("getPhotoLambda", () => {
  const request: AddPhotoRequest = {
    emailAddress: "user@test.com",
    label: "photo label",
    service: "test package",
    vendor: "Test Vendor"
  }
  const expectedHeaders = {
    "access-control-allow-origin": "*"
  }

  it("should return put signed url", async () => {
    const expectedResponseBody = JSON.stringify({putPhotoSignedUrl: putSignedUrl})

    const result = await handler(buildEvent({body: JSON.stringify(request)}))

    expect(result.statusCode).toEqual(201)
    expect(result.headers).toStrictEqual(expectedHeaders)
    expect(result.body).toStrictEqual(expectedResponseBody)
  })

  it("should return 400 when the email address is missing", async () => {
    const {emailAddress, ...requestWithInvalidEmailAddress} = request
    const expectedBody = JSON.stringify({error: "Add photo request is missing emailAddress. Request denied."})

    const result = await handler(buildEvent({body: JSON.stringify(requestWithInvalidEmailAddress)}))

    expect(result.statusCode).toEqual(400)
    expect(result.headers).toStrictEqual(expectedHeaders)
    expect(result.body).toStrictEqual(expectedBody)
  })

  it("should return 400 when the label is missing", async () => {
    const {label, ...requestWithInvalidLabel} = request
    const expectedBody = JSON.stringify({error: "Add photo request is missing label. Request denied."})

    const result = await handler(buildEvent({body: JSON.stringify(requestWithInvalidLabel)}))

    expect(result.statusCode).toEqual(400)
    expect(result.headers).toStrictEqual(expectedHeaders)
    expect(result.body).toStrictEqual(expectedBody)
  })

  it("should return 400 when the service is missing", async () => {
    const {service, ...requestWithMissingService} = request
    const expectedBody = JSON.stringify({error: "Add photo request is missing service. Request denied."})

    const result = await handler(buildEvent({body: JSON.stringify(requestWithMissingService)}))

    expect(result.statusCode).toEqual(400)
    expect(result.headers).toStrictEqual(expectedHeaders)
    expect(result.body).toStrictEqual(expectedBody)
  })

  it("should return 400 when the vendor is missing", async () => {
    const {vendor, ...requestWithMissingVendor} = request
    const expectedBody = JSON.stringify({error: "Add photo request is missing vendor. Request denied."})

    const result = await handler(buildEvent({body: JSON.stringify(requestWithMissingVendor)}))

    expect(result.statusCode).toEqual(400)
    expect(result.headers).toStrictEqual(expectedHeaders)
    expect(result.body).toStrictEqual(expectedBody)
  })
})
