import {PhotoDao} from "../../models/photosModels";
import {getPhotosByUser} from "../../persistence/dbClient";

export async function getPhotos(userId: string): Promise<PhotoDao[] | undefined> {
  return await getPhotosByUser(userId)
}
