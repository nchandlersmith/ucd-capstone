import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {createLogger} from "../utils/logger";
import {CreateCapstoneAccountDao} from "../models/createAccountModels";

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('DynamoDB Utils')
const capstoneAccountsTableName = process.env.CAPSTONE_ACCOUNTS_TABLE_NAME || ''

export function createDynamoDBClient() {
  const isDynamoDBLocal = process.env.LOCAL_DYNAMODB

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

export function storeCapstoneAccount(item: CreateCapstoneAccountDao) {
  logger.info(`Adding item to ${capstoneAccountsTableName}`)
  createDynamoDBClient().put({
    TableName: capstoneAccountsTableName,
    Item: item
  }).promise()
}