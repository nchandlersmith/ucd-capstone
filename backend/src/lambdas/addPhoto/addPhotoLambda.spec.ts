import {AddPhotoRequest} from "../../models/addPhotoModels";
import {handler} from "./addPhotoLambda";
import {buildEvent} from "../../testUtils/eventUtils";

const putSignedUrl = "https://put.com"
jest.mock("../../services/addPhoto/addPhotoService", () => {
  return {
    addPhoto: () => {return putSignedUrl}
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

  it("should return success", async () => {
    const expectedResponseBody = JSON.stringify({putPhotoSignedUrl: putSignedUrl})

    const response = await handler(buildEvent({body: JSON.stringify(request)}))
    expect(response.statusCode).toEqual(201)
    expect(response.headers).toStrictEqual(expectedHeaders)
    expect(response.body).toStrictEqual(expectedResponseBody)
  })
})
