import {addPhoto} from "./addPhotoService"
import {AddPhotoDao, AddPhotoRequest} from "../../models/addPhotoModels"
import {ModelValidationError} from "../../exceptions/exceptions"
import {createGetSignedUrl, createPutSignedUrl} from "../../persistence/s3Client"
import {insertPhoto} from "../../persistence/dbClient";
import {DateTime} from "luxon";

const uuid = "some uuid"
const getUrl = "https://get.com"
const putUrl = "https://put.com"

jest.mock("uuid", () => {
  return {
    v4: () => uuid
  }
})

jest.mock("../../persistence/s3Client", () => {
  return {
    createPutSignedUrl: jest.fn(() => putUrl),
    createGetSignedUrl: jest.fn(() => getUrl)
  }
})

jest.mock("../../persistence/dbClient", () => {
  return {
    insertPhoto: jest.fn(() => {
    })
  }
})

describe("addPhotosService", () => {
  const request: AddPhotoRequest = {
    emailAddress: "test@example.com",
    label: "photo label",
    service: "selected service",
    vendor: "selected vendor"
  }
  const userId = "Test User"

  describe("add photo feature", () => {

    beforeAll(() => {
      const timestamp = 1643593211687
      jest.useFakeTimers('modern')
      jest.setSystemTime(timestamp)
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it("should create pre-signed url to put photo in s3", () => {
      addPhoto(request, userId)
      expect(createPutSignedUrl).toHaveBeenCalledWith(uuid)
    })

    it("should create pre-signed url to get photo from s3", () => {
      addPhoto(request, userId)
      expect(createGetSignedUrl).toHaveBeenCalledWith(uuid)
    })

    it("should insert photo item ", async () => {
      const photoItem: AddPhotoDao = {
        addedOn: DateTime.now().toISO(),
        getPhotoUrl: getUrl,
        photoId: uuid,
        photoLabel: request.label,
        putPhotoUrl: putUrl,
        userId,
        vendorId: request.vendor,
        vendorService: request.service

      }
      await addPhoto(request, userId)
      expect(insertPhoto).toHaveBeenCalledWith(photoItem)
    })

    it('should return put item url', async() => {

      const result = await addPhoto(request, userId)

      expect(result).toEqual(putUrl)
    })
  })

  describe("email validation", () => {
    const emailAddressInvalidRegex = /^Add photo request contains invalid emailAddress. Request denied.$/

    it("should throw error when emailAddress is missing", async () => {
      const {emailAddress, ...requestMissingEmail} = request
      // @ts-ignore
      await expect(async () => await addPhoto(requestMissingEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestMissingEmail)).rejects.toThrow(/^Add photo request is missing emailAddress. Request denied.$/)
    })

    it("should throw error when emailAddress is null", async () => {
      const requestWithBadEmail = {...request, emailAddress: null}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(emailAddressInvalidRegex)
    })

    it("should throw error when emailAddress is undefined", async () => {
      const requestWithBadEmail = {...request, emailAddress: undefined}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(emailAddressInvalidRegex)
    })

    it("should throw error when emailAddress is empty", async () => {
      const requestWithBadEmail = {...request, emailAddress: ""}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(emailAddressInvalidRegex)
    })

    it("should throw error when emailAddress local part is missing", async () => {
      const requestWithBadEmail = {...request, emailAddress: "@string.string"}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(emailAddressInvalidRegex)
    })

    it("should throw error when emailAddress username is missing", async () => {
      const requestWithBadEmail = {...request, emailAddress: "@string.string"}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(emailAddressInvalidRegex)
    })

    it("should throw error when emailAddress @ is missing", async () => {
      const requestWithBadEmail = {...request, emailAddress: "string.string"}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(emailAddressInvalidRegex)
    })

    it("should throw error when domain name is missing", async () => {
      const requestWithBadEmail = {...request, emailAddress: "string@.string"}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(emailAddressInvalidRegex)
    })

    it("should throw error when . is missing", async () => {
      const requestWithBadEmail = {...request, emailAddress: "string@string"}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(emailAddressInvalidRegex)
    })

    it("should throw error when domain is missing", async () => {
      const requestWithBadEmail = {...request, emailAddress: "string@string."}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(emailAddressInvalidRegex)
    })
  })

  describe("vendor validation", () => {
    const vendorInvalidRegex = /^Add photo request contains invalid vendor. Request denied.$/

    it("should throw error when vendor is missing", async () => {
      const {vendor, ...requestMissingVendor} = request
      // @ts-ignore
      await expect(async () => await addPhoto(requestMissingVendor)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestMissingVendor)).rejects.toThrow(/^Add photo request is missing vendor. Request denied.$/)
    })
    it("should throw error when vendor is null", async () => {
      const requestWithBadVendor = {...request, vendor: null}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadVendor)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadVendor)).rejects.toThrow(vendorInvalidRegex)
    })

    it("should throw error when vendor is undefined", async () => {
      const requestWithBadVendor = {...request, vendor: undefined}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadVendor)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadVendor)).rejects.toThrow(vendorInvalidRegex)
    })

    it("should throw error when vendor is empty", async () => {
      const requestWithBadVendor = {...request, vendor: ""}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadVendor)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadVendor)).rejects.toThrow(vendorInvalidRegex)
    })
  })

  describe("label validation", () => {
    const labelInvalidRegex = /^Add photo request contains invalid label. Request denied.$/

    it("should throw error when label is missing", async () => {
      const {label, ...requestMissingLabel} = request
      // @ts-ignore
      await expect(async () => addPhoto(requestMissingLabel)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => addPhoto(requestMissingLabel)).rejects.toThrow(/^Add photo request is missing label. Request denied.$/)
    })
    it("should throw error when label is null", async () => {
      const requestWithBadLabel = {...request, label: null}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadLabel)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadLabel)).rejects.toThrow(labelInvalidRegex)
    })

    it("should throw error when label is undefined", async () => {
      const requestWithBadLabel = {...request, label: undefined}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadLabel)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadLabel)).rejects.toThrow(labelInvalidRegex)
    })

    it("should throw error when label is empty", async () => {
      const requestWithBadLabel = {...request, label: ""}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadLabel)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadLabel)).rejects.toThrow(labelInvalidRegex)
    })
  })

  describe("vendor service validation", () => {
    const invalidServiceRegex = /^Add photo request contains invalid service. Request denied.$/

    it("should throw error when vendor service is missing", async () => {
      const {service, ...requestMissingService} = request
      // @ts-ignore
      await expect(async () => await addPhoto(requestMissingService)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestMissingService)).rejects.toThrow(/^Add photo request is missing service. Request denied.$/)
    })
    it("should throw error when service is null", async () => {
      const requestWithBadService = {...request, service: null}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadService)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadService)).rejects.toThrow(invalidServiceRegex)
    })

  it("should throw error when service is undefined", async () => {
    const requestWithBadService = {...request, service: undefined}
    // @ts-ignore
    await expect(async () => await addPhoto(requestWithBadService)).rejects.toThrow(ModelValidationError)
    // @ts-ignore
    await expect(async () => await addPhoto(requestWithBadService)).rejects.toThrow(invalidServiceRegex)
  })

  it("should throw error when service is empty", async () => {
    const requestWithBadService = {...request, service: ""}
    // @ts-ignore
    await expect(async () => await addPhoto(requestWithBadService)).rejects.toThrow(ModelValidationError)
    // @ts-ignore
    await expect(async () => await addPhoto(requestWithBadService)).rejects.toThrow(invalidServiceRegex)
  })
  })
})
