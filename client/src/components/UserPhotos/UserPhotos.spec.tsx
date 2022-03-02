import UserPhotos from "./UserPhotos";
import {render, screen} from "@testing-library/react";
import axios from "axios";
import {PhotoDao} from "../../../../backend/src/models/photosModels"
import {act} from "react-dom/test-utils";

jest.mock("axios")

describe("<UserPhotos/>", () => {
  it("should display photo data", async () => {
    const userId = "user@test.com"
    const photosFromDb: PhotoDao[] = [{
      vendorService: "Test Service",
      putPhotoUrl: "https://put-photos.com",
      getPhotoUrl: "https://get-photos.com",
      userId,
      photoId: "abc-123",
      vendorId: "Test Vendor",
      photoLabel: "My great photo",
      addedOn: "Some luxon date"
    }]
    const getPhotosResponse = {data:
    {
      photos:photosFromDb
    }};

    await act(async () => {
      await (axios.get as jest.Mock).mockImplementation(() => Promise.resolve(getPhotosResponse))
      render(<UserPhotos userId={userId}/>)
    })

    expect(screen.getByText(photosFromDb[0].photoLabel)).toBeInTheDocument()
    expect(screen.getByText(photosFromDb[0].vendorId)).toBeInTheDocument()
    expect(screen.getByText(photosFromDb[0].vendorService)).toBeInTheDocument()
    expect(screen.getByText(`Added: ${photosFromDb[0].addedOn}`))
  })
})
