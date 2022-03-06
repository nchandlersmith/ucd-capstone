import {render, screen} from "@testing-library/react";
import AddVendorForm from "./AddVendorForm";

describe("<AddVendorForm/>", () => {
  it("should allow vendor to enter their name", () => {
    render(<AddVendorForm/>)

    expect(screen.getByLabelText("Vendor Name")).toBeInTheDocument()
  })

  it("should allow vendor to enter the services they offer", () => {
    render(<AddVendorForm/>)

    expect(screen.getByLabelText("Vendor Services")).toBeInTheDocument()
  })
})
