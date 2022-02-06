import {AddPhotoRequest } from "../../models/addPhotoModels"
import {ModelValidationError} from "../../exceptions/exceptions"

export function addPhoto(request: AddPhotoRequest) {
  validateRequest(request);
  return ""
}

function validateRequest(request: AddPhotoRequest) {
  isRequiredFieldsPresent(request)
  validateEmailAddress(request)
}

function isRequiredFieldsPresent(request: AddPhotoRequest) {
  const requiredFields: (keyof AddPhotoRequest)[] = ["emailAddress", "label", "vendor", "service"]
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
