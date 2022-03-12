import React from 'react'
import {fireEvent, render, RenderResult, screen} from '@testing-library/react'
import AddPhotoForm from "./AddPhotoForm"
import axios from "axios";
import {act} from "react-dom/test-utils";
import {Vendor} from "../../../../backend/src/models/vendorModels"

jest.mock("axios")

describe(`<Photos/>`, function() {
  let wrapper: RenderResult
  const vendors: Vendor[] = [
    {
      vendorName: "Extreme Photo Finishing",
      vendorServices: [
        "Mega Pack",
        "Supreme Pack",
        "Extreme Pack",
        "Mega-Supreme-Extreme Pack"
      ],
      country: "United States"
    },
    {
      vendorName: "Great Photo Prints",
      vendorServices: [
        "Premium",
        "Value"
      ],
      country: "United States"
    }
  ];

  beforeEach(() => {
    (axios.get as jest.Mock).mockImplementation(() => Promise.resolve({data: vendors}))
    wrapper = render(<AddPhotoForm userId={"hard-coded@user.com"}/>)
  })

  describe("vendors dropdown", () => {
    it("should display signed-up vendors in dropdown", () => {
      const vendorDropdown = screen.getByRole("button", {name: "Vendor"})

      fireEvent.click(vendorDropdown)

      expect(screen.getByRole("button", {name: vendors[0].vendorName})).toBeInTheDocument()
      expect(screen.getByRole("button", {name: vendors[1].vendorName})).toBeInTheDocument()
    })

    it("should display the selected vendor", () => {
      const expectedVendorName = vendors[1].vendorName
      const vendorDropdown = screen.getByRole("button", {name: "Vendor"})
      const selectedVendorButton = screen.getByRole("button", {name: expectedVendorName})
      const vendorInput = wrapper.container.querySelector("#vendor")

      fireEvent.click(vendorDropdown)
      fireEvent.click(selectedVendorButton)

      expect(vendorInput).toHaveAttribute("value", expectedVendorName)
    })
  })

  describe("services dropdown", () => {
    it("should have a services dropdown button", () => {
      expect(screen.getByRole("button", {name: "Service"})).toBeInTheDocument()
    })

    it("should display the services for the selected vendor", () => {
      const vendorDropdown = screen.getByRole("button", {name: "Vendor"})
      const selectedVendor = screen.getByRole("button", {name: vendors[1].vendorName})
      const serviceDropdown = screen.getByRole("button", {name: "Service"})

      fireEvent.click(vendorDropdown)
      fireEvent.click(selectedVendor)
      fireEvent.click(serviceDropdown)

      expect(screen.getByRole("button",{name: vendors[1].vendorServices[0]}))
      expect(screen.getByRole("button",{name: vendors[1].vendorServices[1]}))
    })
  })

  describe("upload photo", function () {

    it("should not allow submission until form is complete", async () => {
      const label = "My great photo"
      const photoFile = {
        name: "some photo.png",
        type: "image/png"
      }
      const photoLabelInput = screen.getByLabelText("Photo Label")
      const vendorDropdown = screen.getByRole("button", {name: "Vendor"})
      const vendorSelection = screen.getByRole("button", {name: vendors[0].vendorName})
      const serviceDropdown = screen.getByRole("button", {name: "Service"})
      const photoFileInput = screen.getByLabelText("Photo")
      const addPhotoButton = screen.getByRole("button", {name: "Submit"})

      fireEvent.change(photoLabelInput, {target: {value: label}})
      expect(addPhotoButton).not.toBeEnabled()
      fireEvent.click(vendorDropdown)
      fireEvent.click(vendorSelection)
      expect(addPhotoButton).not.toBeEnabled()
      fireEvent.click(serviceDropdown)
      expect(addPhotoButton).not.toBeEnabled()
      fireEvent.click(screen.getByRole("button", {name: vendors[0].vendorServices[0]}))
      expect(addPhotoButton).not.toBeEnabled()
      fireEvent.change(photoFileInput, {target: {files: [photoFile]}})

      console.log("delete me")

      expect(addPhotoButton).toBeEnabled()
    })

    it("should upload photo to s3", async () => {
      const label = "My great photo"
      const photoFile = {
        name: "some photo.png",
        type: "image/png"
      }
      const photoLabelInput = screen.getByLabelText("Photo Label")
      const vendorDropdown = screen.getByRole("button", {name: "Vendor"})
      const vendorSelection = screen.getByRole("button", {name: vendors[0].vendorName})
      const serviceDropdown = screen.getByRole("button", {name: "Service"})
      const photoFileInput = screen.getByLabelText("Photo")
      const addPhotoButton = screen.getByRole("button", {name: "Submit"});

      (axios.post as jest.Mock).mockImplementation(() => Promise.resolve({data: {putPhotoSignedUrl: "putPhoto"}}));
      (axios.put as jest.Mock).mockImplementation(() => Promise.resolve())

      fireEvent.change(photoLabelInput, {target: {value: label}})
      fireEvent.click(vendorDropdown)
      fireEvent.click(vendorSelection)
      fireEvent.click(serviceDropdown)
      fireEvent.click(screen.getByRole("button", {name: vendors[0].vendorServices[0]}))
      fireEvent.change(photoFileInput, {target: {files: [photoFile]}})

      await act(async () => {
        await fireEvent.click(addPhotoButton)
      })

      expect(axios.post).toHaveBeenCalled()
      expect(axios.put).toHaveBeenCalled()
    })
  })
})
