import UserPhotos from "./UserPhotos";
import {render, screen} from "@testing-library/react";
import axios from "axios";
import {PhotoDao} from "../../../../backend/src/models/photosModels"
import {act} from "react-dom/test-utils";

jest.mock("axios")

describe("<UserPhotos/>", () => {
  const userId = "user@test.com"
  const userFirstPhoto: PhotoDao = {
    vendorService: "Service 1",
    putPhotoUrl: "https://put-photos.com",
    getPhotoUrl: "https://get-photos.com",
    userId,
    photoId: "abc-123",
    vendorId: "My favorite color vendor",
    photoLabel: "My great photo",
    addedOn: "Some luxon date"
  }
  const userSecondPhoto: PhotoDao = {
    vendorService: "Service 2",
    putPhotoUrl: "https://put-photos.com",
    getPhotoUrl: "https://get-photos.com",
    userId,
    photoId: "xyz-123",
    vendorId: "My favorite black and white vendor",
    photoLabel: "My great black and white photo",
    addedOn: "Some other luxon date"
  }

  it("should display photo data", async () => {
    const photosFromDb: PhotoDao[] = [userFirstPhoto]
    const getPhotosResponse = {data: {photos:photosFromDb}};

    await act(async () => {
      await (axios.get as jest.Mock).mockImplementation(() => Promise.resolve(getPhotosResponse))
      render(<UserPhotos userId={userId}/>)
    })

    expect(screen.getByText(photosFromDb[0].photoLabel)).toBeInTheDocument()
    expect(screen.getByText(photosFromDb[0].vendorId)).toBeInTheDocument()
    expect(screen.getByText(photosFromDb[0].vendorService)).toBeInTheDocument()
    expect(screen.getByText(`Added: ${photosFromDb[0].addedOn}`))
  })

  it("should display all photos from the user", async () => {
    const photosFromDb: PhotoDao[] = [userFirstPhoto, userSecondPhoto]
    const getPhotosResponse = {data:{photos:photosFromDb}};

    await act(async () => {
      await (axios.get as jest.Mock).mockImplementation(() => Promise.resolve(getPhotosResponse))
      render(<UserPhotos userId={userId}/>)
    })

    expect(screen.getByText(photosFromDb[0].photoLabel)).toBeInTheDocument()
    expect(screen.getByText(photosFromDb[0].vendorId)).toBeInTheDocument()
    expect(screen.getByText(photosFromDb[0].vendorService)).toBeInTheDocument()
    expect(screen.getByText(`Added: ${photosFromDb[0].addedOn}`))
    expect(screen.getByText(photosFromDb[1].photoLabel)).toBeInTheDocument()
    expect(screen.getByText(photosFromDb[1].vendorId)).toBeInTheDocument()
    expect(screen.getByText(photosFromDb[1].vendorService)).toBeInTheDocument()
    expect(screen.getByText(`Added: ${photosFromDb[1].addedOn}`))
  })
})
