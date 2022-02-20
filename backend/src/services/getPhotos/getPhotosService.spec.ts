import {PhotoDao} from "../../models/photosModels"
import {DateTime} from "luxon"
import {getPhotos} from "./getPhotosService"

const userId = "some user id"
const photos: PhotoDao[] = [{
  addedOn: DateTime.now().toISO(),
  getPhotoUrl: "https://getPhoto.io",
  photoId: "some photo id",
  photoLabel: "some photo label",
  putPhotoUrl: "https://putPhoto.io",
  userId: userId,
  vendorId: "some vendor",
  vendorService: "some service"
}]

jest.mock("../../persistence/dbClient", () => {
  return {
    getPhotosByUser: () => photos
  }
})

describe("get photos service", () => {
  it('should return all photos for a user', async () => {
    const result = await getPhotos(userId)
    expect(result).toStrictEqual(photos)
  })
})
