import * as AWS from "aws-sdk"
import * as AWSXRAY from "aws-xray-sdk"
import {createLogger} from "../utils/logger";

const XAWS = AWSXRAY.captureAWS(AWS)

// TODO: tests would be nice
const photosS3BucketName = process.env.PHOTOS_S3_BUCKET_NAME  || ''
const urlExpirationInSeconds = parseInt(process.env.SIGNED_URL_EXPIRATION_IN_SECONDS || '300')

const s3 = new XAWS.S3({
  signatureVersion: "v4"
})
const logger = createLogger('S3Client')

// I took this from project 4
export function createPutSignedUrl(photoId: string): string {
  logger.info(`Creating putObject signed url for ${photoId}`)
  return s3.getSignedUrl('putObject' ,{
    Bucket: photosS3BucketName,
    Key: photoId,
    Expires: urlExpirationInSeconds
  })
}

export function createGetSignedUrl(photoId: string): string {
  logger.info(`Creating getObject signed url for ${photoId}`)
  return s3.getSignedUrl('getObject' ,{
    Bucket: photosS3BucketName,
    Key: photoId,
    Expires: urlExpirationInSeconds
  })
}

export async function addVendorToList(vendorName: string): Promise<void> {
  logger.info("Called addVendorToList no-op.")
}
