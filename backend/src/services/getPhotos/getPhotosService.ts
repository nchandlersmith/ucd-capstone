import {PhotoData} from "../../models/photosModels";
import {getPhotosByUser} from "../../persistence/dbClient";

export async function getPhotos(userId: string): Promise<PhotoData[]> {
  return await getPhotosByUser(userId)
}
