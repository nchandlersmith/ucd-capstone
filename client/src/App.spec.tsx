import {render, screen} from "@testing-library/react"
import {act} from "react-dom/test-utils";
import axios from "axios";
import {PhotoDao} from "../../backend/src/models/photosModels"
import App from "./App";

jest.mock("axios")

describe("<App/>", () => {
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

  it("should show photos", async () => {
    const photosFromDb: PhotoDao[] = [userFirstPhoto]
    const getPhotosResponse = {data: {photos:photosFromDb}};
    await act(async () => {
      await (axios.get as jest.Mock).mockImplementation(() => Promise.resolve(getPhotosResponse))
      render(<App/>)
  })
    expect(screen.getByRole("button", {name: "My Photos"})).toBeInTheDocument()
  })

  it("should allow user to add photo", async () => {
    const photosFromDb: PhotoDao[] = [userFirstPhoto]
    const getPhotosResponse = {data: {photos:photosFromDb}};
    await act(async () => {
      await (axios.get as jest.Mock).mockImplementation(() => Promise.resolve(getPhotosResponse))
      render(<App/>)
    })
    expect(screen.getByRole("button", {name: "Add Photo"})).toBeInTheDocument()
  })

  it("should allow user to add vendor", async () => {
    const photosFromDb: PhotoDao[] = [userFirstPhoto]
    const getPhotosResponse = {data: {photos:photosFromDb}};
    await act(async () => {
      await (axios.get as jest.Mock).mockImplementation(() => Promise.resolve(getPhotosResponse))
      render(<App/>)
    })
    expect(screen.getByRole("button", {name: "Add Vendor"})).toBeInTheDocument()
  })
})
