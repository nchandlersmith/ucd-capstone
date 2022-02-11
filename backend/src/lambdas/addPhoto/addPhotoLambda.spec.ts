import {AddPhotoRequest} from "../../models/addPhotoModels";
import {handler} from "./addPhotoLambda";
import {buildEvent} from "../../testUtils/eventUtils";

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
    const expectedResponseBody = JSON.stringify({message: "Success"})

    const response = await handler(buildEvent({body: JSON.stringify(request)}))
    expect(response.statusCode).toEqual(201)
    expect(response.headers).toStrictEqual(expectedHeaders)
    expect(response.body).toStrictEqual(expectedResponseBody)
  })

  it("should reject requests missing emailAddress in body", async () => {
    const {emailAddress, ...requestMissingEmailAddress} = request
    const expectedResponseBody = JSON.stringify({error: "Email address missing. Request denied."})

    const response = await handler(buildEvent({body: JSON.stringify(requestMissingEmailAddress)}))
    expect(response.statusCode).toEqual(400)
    expect(response.headers).toStrictEqual(expectedHeaders)
    expect(response.body).toStrictEqual(expectedResponseBody)
  })
})
