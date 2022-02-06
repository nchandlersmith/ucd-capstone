import {addPhoto} from "./addPhotoService"
import {AddPhotoRequest} from "../../models/addPhotoModels"
import {ModelValidationError} from "../../exceptions/exceptions"

describe("addPhotosService", () => {
  const request: AddPhotoRequest = {
    emailAddress: "string@string.string",
    label: "photo label",
    service: "selected service",
    vendor: "selected vendor"
  }

  describe("email validation", () => {
    it("should throw error when emailAddress is null", () => {
      const requestWithBadEmail = {...request, emailAddress: null}
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when emailAddress is undefined", () => {
      const requestWithBadEmail = {...request, emailAddress: undefined}
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when emailAddress is empty", () => {
      const requestWithBadEmail = {...request, emailAddress: ""}
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when emailAddress local part is missing", () => {
      const requestWithBadEmail = {...request, emailAddress: "@string.string"}
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when emailAddress username is missing", () => {
      const requestWithBadEmail = {...request, emailAddress: "@string.string"}
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when emailAddress @ is missing", () => {
      const requestWithBadEmail = {...request, emailAddress: "string.string"}
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when domain name is missing", () => {
      const requestWithBadEmail = {...request, emailAddress: "string@.string"}
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when . is missing", () => {
      const requestWithBadEmail = {...request, emailAddress: "string@string"}
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when domain is missing", () => {
      const requestWithBadEmail = {...request, emailAddress: "string@string."}
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(requestWithBadEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    describe("label validation", () => {
      it("should throw error when label is null", () => {
        const requestWithBadLabel = {...request, label: null}
        // @ts-ignore
        expect(() => addPhoto(requestWithBadLabel)).toThrow(ModelValidationError)
        // @ts-ignore
        expect(() => addPhoto(requestWithBadLabel)).toThrow(/^Label invalid. Request denied.$/)
      })

      it("should throw error when label is undefined", () => {
        const requestWithBadLabel = {...request, label: undefined}
        // @ts-ignore
        expect(() => addPhoto(requestWithBadLabel)).toThrow(ModelValidationError)
        // @ts-ignore
        expect(() => addPhoto(requestWithBadLabel)).toThrow(/^Label invalid. Request denied.$/)
      })

      it("should throw error when label is empty", () => {
        const requestWithBadLabel = {...request, label: ""}
        // @ts-ignore
        expect(() => addPhoto(requestWithBadLabel)).toThrow(ModelValidationError)
        // @ts-ignore
        expect(() => addPhoto(requestWithBadLabel)).toThrow(/^Label invalid. Request denied.$/)
      })
    })

    describe("vendor validation", () => {
      it("should throw error when vendor is null", () => {
        const requestWithBadVendor = {...request, vendor: null}
        // @ts-ignore
        expect(() => addPhoto(requestWithBadVendor)).toThrow(ModelValidationError)
        // @ts-ignore
        expect(() => addPhoto(requestWithBadVendor)).toThrow(/^Vendor invalid. Request denied.$/)
      })
    })
  })
})
