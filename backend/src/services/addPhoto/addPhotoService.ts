import {AddPhotoRequest } from "../../models/addPhotoModels"
import {ModelValidationError} from "../../exceptions/exceptions"
import {createGetSignedUrl, createPutSignedUrl} from "../../persistence/s3Client";
import {v4 as uuidv4} from "uuid"

export function addPhoto(request: AddPhotoRequest) {
  validateRequest(request);
  const photoId = uuidv4()
  createPutSignedUrl(photoId)
  createGetSignedUrl(photoId)
}

function validateRequest(request: AddPhotoRequest) {
  isRequiredFieldsPresent(request)
  validateEmailAddress(request)
}

function isRequiredFieldsPresent(request: AddPhotoRequest) {
  const requiredFields = Object.keys(request) as (keyof AddPhotoRequest)[]
  requiredFields.forEach((field) => {
    if(!request[field]) {
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
  if (
    isMissingUsername(request.emailAddress)
    || isMissingAt(request.emailAddress)
    || isMissingDomainName(request.emailAddress)
    || isMissingDot(request.emailAddress)
    || isMissingDomain(request.emailAddress)) {
    throw new ModelValidationError("Email address invalid. Request denied.")
  }
}

function isMissingUsername(emailAddress: string) {
  return emailAddress.indexOf("@") === 0
}

function isMissingAt(emailAddress: string) {
  return !emailAddress.includes("@")
}

function isMissingDomainName(emailAddress: string) {
  return emailAddress.includes("@.")
}

function isMissingDot(emailAddress: string) {
  return !emailAddress.split("@")[1].includes(".")
}

function isMissingDomain(emailAddress: string) {
  return emailAddress.split("@")[1].split(".")[1].length === 0
}
