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
  })

  describe("email validation", () => {
    it("should throw error when emailAddress is missing", async () => {
      const {emailAddress, ...requestMissingEmail} = request
      // @ts-ignore
      await expect(async () => await addPhoto(requestMissingEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestMissingEmail)).rejects.toThrow(/^Email address missing. Request denied.$/)
    })

    it("should throw error when emailAddress is null", async () => {
      const requestWithBadEmail = {...request, emailAddress: null}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when emailAddress is undefined", async () => {
      const requestWithBadEmail = {...request, emailAddress: undefined}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when emailAddress is empty", async () => {
      const requestWithBadEmail = {...request, emailAddress: ""}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when emailAddress local part is missing", async () => {
      const requestWithBadEmail = {...request, emailAddress: "@string.string"}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when emailAddress username is missing", async () => {
      const requestWithBadEmail = {...request, emailAddress: "@string.string"}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when emailAddress @ is missing", async () => {
      const requestWithBadEmail = {...request, emailAddress: "string.string"}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when domain name is missing", async () => {
      const requestWithBadEmail = {...request, emailAddress: "string@.string"}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when . is missing", async () => {
      const requestWithBadEmail = {...request, emailAddress: "string@string"}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(/^Email address invalid. Request denied.$/)
    })

    it("should throw error when domain is missing", async () => {
      const requestWithBadEmail = {...request, emailAddress: "string@string."}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadEmail)).rejects.toThrow(/^Email address invalid. Request denied.$/)
    })

    describe("vendor validation", () => {
      it("should throw error when vendor is missing", async () => {
        const {vendor, ...requestMissingVendor} = request
        // @ts-ignore
        await expect(async () => await addPhoto(requestMissingVendor)).rejects.toThrow(ModelValidationError)
        // @ts-ignore
        await expect(async () => await addPhoto(requestMissingVendor)).rejects.toThrow(/^Vendor missing. Request denied.$/)
      })
      it("should throw error when vendor is null", async () => {
        const requestWithBadVendor = {...request, vendor: null}
        // @ts-ignore
        await expect(async () => await addPhoto(requestWithBadVendor)).rejects.toThrow(ModelValidationError)
        // @ts-ignore
        await expect(async () => await addPhoto(requestWithBadVendor)).rejects.toThrow(/^Vendor invalid. Request denied.$/)
      })

      it("should throw error when vendor is undefined", async () => {
        const requestWithBadVendor = {...request, vendor: undefined}
        // @ts-ignore
        await expect(async () => await addPhoto(requestWithBadVendor)).rejects.toThrow(ModelValidationError)
        // @ts-ignore
        await expect(async () => await addPhoto(requestWithBadVendor)).rejects.toThrow(/^Vendor invalid. Request denied.$/)
      })

      it("should throw error when vendor is empty", async () => {
        const requestWithBadVendor = {...request, vendor: ""}
        // @ts-ignore
        await expect(async () => await addPhoto(requestWithBadVendor)).rejects.toThrow(ModelValidationError)
        // @ts-ignore
        await expect(async () => await addPhoto(requestWithBadVendor)).rejects.toThrow(/^Vendor invalid. Request denied.$/)
      })
    })

    describe("label validation", () => {
      it("should throw error when label is missing", async () => {
        const {label, ...requestMissingLabel} = request
        // @ts-ignore
        await expect(async () => addPhoto(requestMissingLabel)).rejects.toThrow(ModelValidationError)
        // @ts-ignore
        await expect(async () => addPhoto(requestMissingLabel)).rejects.toThrow(/^Label missing. Request denied.$/)
      })
      it("should throw error when label is null", async () => {
        const requestWithBadLabel = {...request, label: null}
        // @ts-ignore
        await expect(async () => await addPhoto(requestWithBadLabel)).rejects.toThrow(ModelValidationError)
        // @ts-ignore
        await expect(async () => await addPhoto(requestWithBadLabel)).rejects.toThrow(/^Label invalid. Request denied.$/)
      })

      it("should throw error when label is undefined", async () => {
        const requestWithBadLabel = {...request, label: undefined}
        // @ts-ignore
        await expect(async () => await addPhoto(requestWithBadLabel)).rejects.toThrow(ModelValidationError)
        // @ts-ignore
        await expect(async () => await addPhoto(requestWithBadLabel)).rejects.toThrow(/^Label invalid. Request denied.$/)
      })

      it("should throw error when label is empty", async () => {
        const requestWithBadLabel = {...request, label: ""}
        // @ts-ignore
        await expect(async () => await addPhoto(requestWithBadLabel)).rejects.toThrow(ModelValidationError)
        // @ts-ignore
        await expect(async () => await addPhoto(requestWithBadLabel)).rejects.toThrow(/^Label invalid. Request denied.$/)
      })
    })

    describe("vendor service validation", () => {
      it("should throw error when vendor service is missing", async () => {
        const {service, ...requestMissingService} = request
        // @ts-ignore
        await expect(async () => await addPhoto(requestMissingService)).rejects.toThrow(ModelValidationError)
        // @ts-ignore
        await expect(async () => await addPhoto(requestMissingService)).rejects.toThrow(/^Service missing. Request denied.$/)
      })
      it("should throw error when service is null", async () => {
        const requestWithBadService = {...request, service: null}
        // @ts-ignore
        await expect(async () => await addPhoto(requestWithBadService)).rejects.toThrow(ModelValidationError)
        // @ts-ignore
        await expect(async () => await addPhoto(requestWithBadService)).rejects.toThrow(/^Service invalid. Request denied.$/)
      })
    })

    it("should throw error when service is undefined", async () => {
      const requestWithBadService = {...request, service: undefined}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadService)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadService)).rejects.toThrow(/^Service invalid. Request denied.$/)
    })

    it("should throw error when service is empty", async () => {
      const requestWithBadService = {...request, service: ""}
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadService)).rejects.toThrow(ModelValidationError)
      // @ts-ignore
      await expect(async () => await addPhoto(requestWithBadService)).rejects.toThrow(/^Service invalid. Request denied.$/)
    })
  })
})
