import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import AddPhotoForm from "./AddPhotoForm"
import axios from "axios";

jest.mock("axios")

describe(`<Photos/>`, function() {

  beforeEach(() => {
    render(<AddPhotoForm userId={"hard-coded@user.com"}/>)
  })

  describe("upload photo", function () {
    it("should not allow submission until form is complete", function () {
      const label = "My great photo"
      const vendor = "Great Pho-toes"
      const service = "8x10 Glossy"
      const photoFile = {
        name: "some photo.png",
        type: "image/png"
      }
      const photoLabelInput = screen.getByLabelText("Photo Label")
      const vendorInput = screen.getByLabelText("Vendor")
      const serviceInput = screen.getByLabelText("Service")
      const photoFileInput = screen.getByLabelText("Photo")
      const addPhotoButton = screen.getByRole("button", {name: "Submit"})

      fireEvent.change(photoLabelInput, {target: {value: label}})
      expect(addPhotoButton).not.toBeEnabled()
      fireEvent.change(vendorInput, {target: {value: vendor}})
      expect(addPhotoButton).not.toBeEnabled()
      fireEvent.change(serviceInput, {target: {value: service}})
      expect(addPhotoButton).not.toBeEnabled()
      fireEvent.change(photoFileInput, {target: {files: [photoFile]}})

      expect(addPhotoButton).toBeEnabled()
    })

    it("should upload photo to s3", async () => {
      const label = "My great photo"
      const vendor = "Great Pho-toes"
      const service = "8x10 Glossy"
      const photoFile = {
        name: "some photo.png",
        type: "image/png"
      }
      const photoLabelInput = screen.getByLabelText("Photo Label")
      const vendorInput = screen.getByLabelText("Vendor")
      const serviceInput = screen.getByLabelText("Service")
      const photoFileInput = screen.getByLabelText("Photo")
      const addPhotoButton = screen.getByRole("button", {name: "Submit"});

      (axios.post as jest.Mock).mockImplementation(() => Promise.resolve({data: {putPhotoSignedUrl: "putPhoto"}}));
      (axios.put as jest.Mock).mockImplementation(() => jest.fn())

      fireEvent.change(photoLabelInput, {target: {value: label}})
      fireEvent.change(vendorInput, {target: {value: vendor}})
      fireEvent.change(serviceInput, {target: {value: service}})
      fireEvent.change(photoFileInput, {target: {files: [photoFile]}})
      fireEvent.click(addPhotoButton)

      expect(axios.post).toHaveBeenCalled()
      expect(axios.put).toHaveBeenCalled()
    })
  })
})
