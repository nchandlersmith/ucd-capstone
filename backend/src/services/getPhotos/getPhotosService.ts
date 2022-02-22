import {PhotoDao} from "../../models/photosModels";
import {getPhotosByUser} from "../../persistence/dbClient";

export async function getPhotos(userId: string): Promise<PhotoDao[]> {
  return await getPhotosByUser(userId)
}
