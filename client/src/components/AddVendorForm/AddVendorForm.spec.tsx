import {fireEvent, render, screen} from "@testing-library/react";
import AddVendorForm from "./AddVendorForm";

describe("<AddVendorForm/>", () => {
  beforeEach(() => {
    render(<AddVendorForm/>)
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
})
