import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {createLogger} from "../utils/logger";
import {CreateCapstoneAccountDao} from "../models/createAccountModels";
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {PhotoDao} from "../models/photosModels";

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('DynamoDB Utils')
const capstoneAccountsTableName = process.env.CAPSTONE_ACCOUNTS_TABLE_NAME || ''
const photosTableName = process.env.PHOTOS_TABLE_NAME || ''

function createDynamoDBClient() {
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

export function insertCapstoneAccount(item: CreateCapstoneAccountDao) {
  logger.info(`Adding item to ${capstoneAccountsTableName}`)
  createDynamoDBClient().put({
    TableName: capstoneAccountsTableName,
    Item: item
  })
}

export async function getAccountsByUser(userId: string): Promise<DocumentClient.QueryOutput> {
  const dynamoClient = createDynamoDBClient()
  const params = {
    TableName: capstoneAccountsTableName,
    ExpressionAttributeValues: {':userId': userId},
    KeyConditionExpression: 'userId = :userId'
  }
  const dbResult = await dynamoClient.query(params).promise()
  logger.info(`Number of items returned from DynamoDB: ${dbResult.Items?.length}`)
  return dbResult;
}

export async function insertPhoto(item: PhotoDao) {
  logger.info(`Adding photo item: ${JSON.stringify(item)} to ${photosTableName}`)
  await createDynamoDBClient().put({
    TableName: photosTableName,
    Item: item
  }).promise().catch(error => logger.error(`Error adding item to Dynamo: ${JSON.stringify(error)}`))
}

export async function getPhotosByUser(userId: string): Promise<PhotoDao[] | undefined> {
  const dynamoClient = createDynamoDBClient()
  const params = {
    TableName: capstoneAccountsTableName,
    ExpressionAttributeValues: {":userId": userId},
    KeyConditionExpression: "userId = :userId"
  }
  const dbResult = await dynamoClient.query(params).promise()
  logger.info(`Number of photos returned from DynamoDB: ${dbResult.Items?.length}`)
  return dbResult?.Items as PhotoDao[]
}
