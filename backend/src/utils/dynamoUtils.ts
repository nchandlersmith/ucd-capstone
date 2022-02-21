import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import {createLogger} from "./logger";

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger("dynamoUtils")

export function createDynamoDBClient() {
  const isDynamoDBLocal = process.env.USE_LOCAL_DYNAMODB

  if (isDynamoDBLocal) {
    logger.info('Using local DynamoDB client')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
      accessKeyId: 'some access key',
      secretAccessKey: 'some secret'
    })
  }
  logger.info('Using cloud DynamoDBClient')
  return new XAWS.DynamoDB.DocumentClient()
}
