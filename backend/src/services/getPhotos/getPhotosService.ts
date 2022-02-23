import {PhotoDao} from "../../models/photosModels";
import {getPhotosByUser} from "../../persistence/dbClient";

// TODO: should not return DAO
export async function getPhotos(userId: string): Promise<PhotoDao[]> {
  return await getPhotosByUser(userId)
}
