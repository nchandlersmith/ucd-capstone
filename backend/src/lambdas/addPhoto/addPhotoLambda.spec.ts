import {AddPhotoRequest} from "../../models/addPhotoModels";
import {handler} from "./addPhotoLambda";
import {buildEvent} from "../../testUtils/eventUtils";

describe("getPhotoLambda", () => {
  it("should return success", async () => {
    const request: AddPhotoRequest = {
      emailAddress: "user@test.com",
      label: "photo label",
      service: "test package",
      vendor: "Test Vendor"
    }
    const expectedHeaders = {
      "access-control-allow-origin": "*"
    }
    const expectedResponseBody = JSON.stringify({message: "Success"})

    const response = await handler(buildEvent({body: JSON.stringify(request)}))
    expect(response.statusCode).toEqual(201)
    expect(response.headers).toStrictEqual(expectedHeaders)
    expect(response.body).toStrictEqual(expectedResponseBody)
  })
})
