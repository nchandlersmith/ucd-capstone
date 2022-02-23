import {createLogger} from "../utils/logger"
import {CreateCapstoneAccountDao} from "../models/createAccountModels"
import {DocumentClient} from "aws-sdk/clients/dynamodb"
import {PhotoDao} from "../models/photosModels"
import {createDynamoDBClient} from "../utils/dynamoUtils"
import {VendorDao} from "../models/vendorModels"

const logger = createLogger('dbClient')
const capstoneAccountsTableName = process.env.CAPSTONE_ACCOUNTS_TABLE_NAME || ""
const photosTableName = process.env.PHOTOS_TABLE_NAME || ""
const vendorTableName = process.env.VENDOR_TABLE_NAME || ""

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
  }).promise()
}

export async function getPhotosByUser(userId: string): Promise<PhotoDao[]> {
  logger.info(`Getting photos for: ${userId}`)
  const dynamoClient = createDynamoDBClient()
  const params = {
    TableName: photosTableName,
    ExpressionAttributeValues: {":userId": userId},
    KeyConditionExpression: "userId = :userId"
  }
  const dbResult = await dynamoClient.query(params).promise()
  logger.info(`Response from db: ${JSON.stringify(dbResult)}`)
  return dbResult.Items as PhotoDao[]
}

export async function insertVendor(item: VendorDao): Promise<void> {
  logger.info(`Creating vendor: ${JSON.stringify(item)}`)
  await createDynamoDBClient().put({
    TableName: vendorTableName,
    Item: item
  }).promise()
}
