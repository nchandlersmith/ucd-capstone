import {AddPhotoRequest } from "../../models/addPhotoModels"
import {ModelValidationError} from "../../exceptions/exceptions"

export function addPhoto(request: AddPhotoRequest) {
  simpleFieldValidation(request)
  validateEmailAddress(request)
  validateLabel(request);
  if(request.vendor === null) {
    throw new ModelValidationError("Vendor invalid. Request denied.")
  }
  return ""
}

function simpleFieldValidation(request: AddPhotoRequest) {
  const fields: (keyof AddPhotoRequest)[] = ["emailAddress", "label"]
  fields.forEach((field) => {
    if(!request[field]) {
      throw new ModelValidationError(`${errorTranslations[field]} invalid. Request denied.`)
    }
  })
}

const errorTranslations: AddPhotoRequest = {
  emailAddress: "Email address",
  label: "Label",
  service: "", vendor: ""
}

function validateEmailAddress(request: AddPhotoRequest) {
  if (!request.emailAddress
    || isMissingUsername(request.emailAddress)
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

function validateLabel(request: AddPhotoRequest) {
  if (!request.label) {
    throw new ModelValidationError("Label invalid. Request denied.")
  }
}
