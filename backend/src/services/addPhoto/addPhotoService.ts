import {AddPhotoRequest} from "../../models/addPhotoModels";
import {ModelValidationError} from "../../exceptions/exceptions";

export function addPhoto(request: AddPhotoRequest) {
  if (!request.emailAddress
      || isMissingUsername(request.emailAddress)
      || isMissingAt(request.emailAddress)
      || isMissingDomainName(request.emailAddress)
      || isMissingDot(request.emailAddress)
      || isMissingDomain(request.emailAddress)) {
    throw new ModelValidationError("Email address invalid. Request denied.")
  }
  return ""
}

function isMissingUsername(emailAddress: string) {
  return emailAddress.indexOf("@") === 0
}

function isMissingAt(emailAddress: string) {
  return !emailAddress.includes("@");
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