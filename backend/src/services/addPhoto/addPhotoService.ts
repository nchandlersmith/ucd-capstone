import {AddPhotoDao, AddPhotoRequest} from "../../models/addPhotoModels"
import {ModelValidationError} from "../../exceptions/exceptions"
import {createGetSignedUrl, createPutSignedUrl} from "../../persistence/s3Client"
import {v4 as uuidv4} from "uuid"
import {insertPhoto} from "../../persistence/dbClient"
import {DateTime} from "luxon"
import {createLogger} from "../../utils/logger";

const logger = createLogger("addPhotoService")

export function addPhoto(request: AddPhotoRequest, userId: string) {
  validateRequest(request);
  const addedOn = DateTime.now().toISO()
  const photoId = uuidv4()
  const putPhotoUrl = createPutSignedUrl(photoId)
  const getPhotoUrl = createGetSignedUrl(photoId)
  const photoItem: AddPhotoDao = {
    addedOn,
    getPhotoUrl,
    photoId,
    photoLabel: request.label,
    putPhotoUrl,
    userId,
    vendorId: request.vendor,
    vendorService: request.service
  }
  insertPhoto(photoItem)
}

function validateRequest(request: AddPhotoRequest) {
  logger.info(`Validating add photo request ${JSON.stringify(request)}`)
  verifyRequiredFieldsPresent(request)
  verifyFieldsPopulated(request)
  validateEmailAddress(request)
}

function verifyRequiredFieldsPresent(request: AddPhotoRequest) {
  const requiredFields = ["emailAddress", "label", "service", "vendor"] as (keyof AddPhotoRequest)[]
  const presentFields = Object.keys(request)
  requiredFields.forEach((field) => {
    if(!presentFields.includes(field)) {
      throw new ModelValidationError(`${requiredFieldsErrorTranslations[field]} missing. Request denied.`)
    }
  })
}

function verifyFieldsPopulated(request: AddPhotoRequest) {
  const fields = Object.keys(request) as (keyof AddPhotoRequest)[]
  fields.forEach((field) => {
    logger.info(`Testing ${field} on request gives ${request[field]}`)
    if(!request[field]) {
      logger.error(`Add photo request missing field: ${field}`)
      throw new ModelValidationError(`${requiredFieldsErrorTranslations[field]} invalid. Request denied.`)
    }
  })
}

const requiredFieldsErrorTranslations: AddPhotoRequest = {
  emailAddress: "Email address",
  label: "Label",
  service: "Service",
  vendor: "Vendor"
}

function validateEmailAddress(request: AddPhotoRequest) {
  const validEmail = /^\S+@\S+\.\S+$/
  if (!validEmail.test(request.emailAddress)) {
    throw new ModelValidationError("Email address invalid. Request denied.")
  }
}
