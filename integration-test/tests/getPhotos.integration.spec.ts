import {deletePhotosByUserAndPhotoIds, findAllPhotosByUserId, putPhoto} from "../utils/dynamoUtils";
import {PhotoDao} from "../../backend/src/models/photosModels"
import {DateTime} from "luxon";
import axios from "axios";

describe("get photos persistence", () => {
  const photosUrl = "http://localhost:3000/dev/photos"
  const userId = "Integration Test User"
  const otherUserId = "Ghost Rider"

  const myPhoto: PhotoDao = {
    addedOn: DateTime.now().toISO(),
    getPhotoUrl: "https://getMyPhoto.net",
    photoId: "my photo id",
    photoLabel: "my great photo",
    putPhotoUrl: "https://putMyPhoto.io",
    userId,
    vendorId: "my vendor",
    vendorService: "my service selection"
  }

  const yourPhoto: PhotoDao = {
    addedOn: DateTime.now().toISO(),
    getPhotoUrl: "https://getYourPhoto.biz",
    photoId: "your photo id",
    photoLabel: "your photo label",
    putPhotoUrl: "https://putyourphoto.org",
    userId: otherUserId,
    vendorId: "your vendor",
    vendorService: "your service selection"
  }

  beforeAll(async () => {
    await deleteAllPhotosByUser(userId);
    await deleteAllPhotosByUser(otherUserId)
  })

  afterEach(async () => {
    await deleteAllPhotosByUser(userId);
    await deleteAllPhotosByUser(otherUserId)
  })

  it("should return photos owned by specified user", async () => {
    await putPhoto(myPhoto)
    await putPhoto(yourPhoto)

    const result = await axios.get(photosUrl, {headers: {Authorization: `Bearer blarg-${userId}`}})

    expect(result.status).toEqual(201)
    expect(result.data.photos.length).toEqual(1)
    expect(result.data.photos[0]).toStrictEqual(myPhoto)
  })

  it("should not return photos when the auth header is missing", async () => {
    await putPhoto(myPhoto)
    await putPhoto(yourPhoto)

    const result = await axios.get(photosUrl, {headers: {}}).catch(error => error)

    expect(result.response.status).toEqual(403)
    expect(Object.keys(result.response.headers)).toContain("access-control-allow-origin")
    expect(result.response.headers["access-control-allow-origin"]).toEqual("*")
    expect(result.response.data).toEqual({error: "Unauthorized user"})
  })

  it("should not return photos when user is unauthorized", async () => {
    const invalidAuthToken = "sad day"
    await putPhoto(myPhoto)
    await putPhoto(yourPhoto)

    const result = await axios.get(photosUrl, {headers: {Authorization: `Bearer ${invalidAuthToken}`}}).catch(error => error)

    expect(result.response.status).toEqual(403)
    expect(Object.keys(result.response.headers)).toContain("access-control-allow-origin")
    expect(result.response.headers["access-control-allow-origin"]).toEqual("*")
    expect(result.response.data).toEqual({error: "Unauthorized user"})
  })
})

async function deleteAllPhotosByUser(userId: string) {
  const dynamoResponse = await findAllPhotosByUserId(userId)
  for (const item of dynamoResponse.Items) {
    await deletePhotosByUserAndPhotoIds(item.photoId, userId)
      .catch((error: any) => console.error(`Error occurred while cleaning up dynamo${error.message}`))
  }
}
