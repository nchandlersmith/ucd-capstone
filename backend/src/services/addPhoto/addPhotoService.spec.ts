import {addPhoto} from "./addPhotoService"
import {AddPhotoRequest} from "../../models/addPhotoModels"
import {ModelValidationError} from "../../exceptions/exceptions"

describe("addPhotosService", () => {
  describe("email validation", () => {
    const request: AddPhotoRequest = {
      emailAddress: "string@string.string",
      label: "photo label",
      service: "selected service",
      vendor: "selected vendor"
    }

    it("should throw error when emailAddress is null", () => {
      const nullEmail = {...request, emailAddress: null}
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when emailAddress is undefined", () => {
      const nullEmail = {...request, emailAddress: undefined}
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when emailAddress is empty", () => {
      const nullEmail = {...request, emailAddress: ""}
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when emailAddress local part is missing", () => {
      const nullEmail = {...request, emailAddress: "@string.string"}
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when emailAddress username is missing", () => {
      const nullEmail = {...request, emailAddress: "@string.string"}
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when emailAddress @ is missing", () => {
      const nullEmail = {...request, emailAddress: "string.string"}
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when domain name is missing", () => {
      const nullEmail = {...request, emailAddress: "string@.string"}
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when . is missing", () => {
      const nullEmail = {...request, emailAddress: "string@string"}
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when domain is missing", () => {
      const nullEmail = {...request, emailAddress: "string@string."}
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(ModelValidationError)
      // @ts-ignore
      expect(() => addPhoto(nullEmail)).toThrow(/^Email address invalid. Request denied.$/)
    })

  })
})
