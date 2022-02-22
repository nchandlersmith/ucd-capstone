import {handler} from "./getPhotosLambda";
import {buildEvent} from "../../testUtils/eventUtils";
import {PhotoPackage} from "../../models/photosModels";
import {DateTime} from "luxon";
import {getPhotosByUser} from "../../persistence/dbClient";

jest.mock("../../persistence/dbClient", () => {
  return {
    getPhotosByUser: jest.fn()
  }
})


describe("getPhotosLambda", () => {
  const userId = "unit test user"
  const authHeader = {Authorization: `Bearer blarg-${userId}`}
  const requiredHeaders = {"access-control-allow-origin": "*"}

  it("should return photo data", async () => {
    const expectedPhotos: PhotoPackage[] = [{
      addedOn: DateTime.now().toISO(),
      getPhotoUrl: "https://getPhotos.io",
      photoId: "photo id",
      photoLabel: "photo label",
      putPhotoUrl: "https://putPhotos.biz",
      userId,
      vendorId: "Ye Olde Photo Shop",
      vendorService: "Bendy Circus Package"
    }];
    (getPhotosByUser as jest.Mock).mockImplementation(() => expectedPhotos)

    const result = await handler(buildEvent({headers: authHeader}))

    expect(result.statusCode).toStrictEqual(201)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(JSON.stringify({photos: expectedPhotos}))
  })

  it("should reject requests missing the auth header", async () => {
    const expectedErrorMessage = "Unauthorized user"

    const result =  await handler(buildEvent())

    expect(result.statusCode).toEqual(403)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(JSON.stringify({error: expectedErrorMessage}))
  })

  it("should reject requests from unauthorized users", async () => {
    const unauthorizedUser = "Unauthorized user"
    const invalidAuthHeader = {Authorization: `Bearer invalid-${unauthorizedUser}`}
    const expectedErrorMessage = "Unauthorized user"

    const result = await handler(buildEvent({headers: invalidAuthHeader}))

    expect(result.statusCode).toEqual(403)
    expect(result.headers).toStrictEqual(requiredHeaders)
    expect(result.body).toStrictEqual(JSON.stringify({error: expectedErrorMessage}))
  })
})
