import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import AddPhotoForm from "./AddPhotoForm"
import MockAdapter from "axios-mock-adapter"
import axios from "axios"

const axiosMock = new MockAdapter(axios)

describe(`<Photos/>`, function() {
  describe("upload photo", function () {
    it("should not allow submission until form is complete", function () {
      render(<AddPhotoForm userId={"hard-coded@user.com"}/>)
      const emailAddress = "user@test.io"
      const label = "My great photo"
      const vendor = "Great Pho-toes"
      const service = "8x10 Glossy"
      const emailAddressInput = screen.getByLabelText("User")
      const photoLabelInput = screen.getByLabelText("Photo Label")
      const vendorInput = screen.getByLabelText("Vendor")
      const serviceInput = screen.getByLabelText("Service")
      const addPhotoButton = screen.getByRole("button", {name: "Submit"})

      expect(addPhotoButton).not.toBeEnabled()

      fireEvent.change(emailAddressInput, {target: {value: emailAddress}})
      fireEvent.change(photoLabelInput, {target: {value: label}})
      fireEvent.change(vendorInput, {target: {value: vendor}})
      fireEvent.change(serviceInput, {target: {value: service}})

      expect(addPhotoButton).toBeEnabled()
    })
  })
})
