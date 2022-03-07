import {fireEvent, render, screen} from "@testing-library/react";
import AddVendorForm from "./AddVendorForm";
import axios from "axios";
import {act} from "react-dom/test-utils";

jest.mock("axios")

describe("<AddVendorForm/>", () => {
  beforeEach(() => {
    render(<AddVendorForm userId="test@example.com"/>)
  })

  it("should allow vendor to enter their name", () => {
    expect(screen.getByLabelText("Vendor Name")).toBeInTheDocument()
  })

  it("should allow vendor to enter the services they offer", () => {
    expect(screen.getByLabelText("Vendor Services")).toBeInTheDocument()
  })

  it("should capture all the services the vendor offers", () => {
    const vendorServiceEntry = screen.getByLabelText("Vendor Services")
    const addServiceButton = screen.getByRole("button", {name: "Add to list"})

    fireEvent.change(vendorServiceEntry, {target: {value: "Premium"}})
    fireEvent.click(addServiceButton)
    fireEvent.change(vendorServiceEntry, {target:{value: "Value"}})
    fireEvent.click(addServiceButton)

    expect(screen.getByText("Premium")).toBeInTheDocument()
    expect(screen.getByText("Value")).toBeInTheDocument()
  })

  it("should allow the user to submit the form when filled out", async () => {
    const vendorNameInput = screen.getByLabelText("Vendor Name")
    const vendorServiceInput = screen.getByLabelText("Vendor Services")
    const addServiceButton = screen.getByRole("button", {name: "Add to list"})
    const addVendorButton = screen.getByRole("button", {name: "Submit"});
    (axios.post as jest.Mock).mockImplementation(() => Promise.resolve())

    expect(addVendorButton).toBeDisabled()

    fireEvent.change(vendorNameInput, {target: {value: "Great Vendor"}})
    fireEvent.change(vendorServiceInput, {target: {value: "Premium"}})
    fireEvent.change(vendorServiceInput, {target: {value: "Premium"}})
    fireEvent.click(addServiceButton)
    fireEvent.change(vendorServiceInput, {target:{value: "Value"}})
    fireEvent.click(addServiceButton)

    expect(addVendorButton).toBeEnabled()

    await act(async () => {
      await fireEvent.click(addVendorButton)
    })

    expect(axios.post).toHaveBeenCalled()
  })
})
