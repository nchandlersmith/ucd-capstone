import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import AddPhotoForm from "./AddPhotoForm"

describe(`<Photos/>`, function() {
  describe("upload photo", function () {
    it("should not allow submission until form is complete", function () {
      render(<AddPhotoForm userId={"hard-coded@user.com"}/>)
      const label = "My great photo"
      const vendor = "Great Pho-toes"
      const service = "8x10 Glossy"
      const photoFile = ""
      const photoLabelInput = screen.getByLabelText("Photo Label")
      const vendorInput = screen.getByLabelText("Vendor")
      const serviceInput = screen.getByLabelText("Service")
      const photoFileInput = screen.getByLabelText("Photo")
      const addPhotoButton = screen.getByRole("button", {name: "Submit"})

      expect(addPhotoButton).not.toBeEnabled()

      fireEvent.change(photoLabelInput, {target: {value: label}})
      fireEvent.change(vendorInput, {target: {value: vendor}})
      fireEvent.change(serviceInput, {target: {value: service}})
      fireEvent.change(photoFileInput, {target: {value: photoFile}})

      expect(addPhotoButton).toBeEnabled()
    })
  })
})
