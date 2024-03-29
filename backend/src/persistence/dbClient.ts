import {createLogger} from "../utils/logger"
import {CreateCapstoneAccountDao} from "../models/createAccountModels"
import {DocumentClient} from "aws-sdk/clients/dynamodb"
import {PhotoByVendor, PhotoData} from "../models/photosModels"
import {createDynamoDBClient} from "../utils/dynamoUtils"
import {Vendor} from "../models/vendorModels"

const logger = createLogger('dbClient')
const capstoneAccountsTableName = process.env.CAPSTONE_ACCOUNTS_TABLE_NAME || ""
const photosTableName = process.env.PHOTOS_TABLE_NAME || ""
const photosByVendorGsiName = process.env.PHOTOS_BY_VENDOR_GSI_NAME || ""
const vendorTableName = process.env.VENDORS_TABLE_NAME || ""

export function insertCapstoneAccount(item: CreateCapstoneAccountDao) {
  logger.info(`Adding item to ${capstoneAccountsTableName}`)
  createDynamoDBClient().put({
    TableName: capstoneAccountsTableName,
    Item: item
  })
}

// TODO: make this return a list of Capstone Accounts
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

export async function insertPhoto(item: PhotoData) {
  logger.info(`Adding photo item: ${JSON.stringify(item)} to ${photosTableName}`)
  await createDynamoDBClient().put({
    TableName: photosTableName,
    Item: item
  }).promise()
}

export async function getPhotosByUser(userId: string): Promise<PhotoData[]> {
  logger.info(`Getting photos for: ${userId}`)
  const dynamoClient = createDynamoDBClient()
  const params = {
    TableName: photosTableName,
    ExpressionAttributeValues: {":userId": userId},
    KeyConditionExpression: "userId = :userId"
  }
  const dbResult = await dynamoClient.query(params).promise()
  logger.info(`Response from db: ${JSON.stringify(dbResult)}`)
  return dbResult.Items as PhotoData[]
}

export async function getPhotosByVendor(vendorName: string): Promise<PhotoByVendor[]> {
  logger.info(`Getting photos from db for vendor: ${vendorName}`)
  const dynamoClient = createDynamoDBClient()
  const params = {
    TableName: photosTableName,
    IndexName: photosByVendorGsiName,
    ExpressionAttributeValues: {":vendorName": vendorName},
    KeyConditionExpression: "vendorId = :vendorName",
    ProjectionExpression: "addedOn, getPhotoUrl, photoLabel, vendorService"
  }
  const dbResult = await dynamoClient.query(params).promise()
  logger.info(`Response from db: ${JSON.stringify(dbResult)}`)
  return dbResult.Items as PhotoByVendor[]
}

export async function insertVendor(item: Vendor): Promise<void> {
  logger.info(`Inserting vendor item: ${JSON.stringify(item)}`)
  const dbClient = createDynamoDBClient()
  const params = {
    TableName: vendorTableName,
    Item: item
  }
  await dbClient.put(params).promise()
}

export async function getAllVendors(): Promise<Vendor[]> {
  logger.info("Getting all vendors from db")
  const dbClient = createDynamoDBClient()
  const params = {
    TableName: vendorTableName,
    ExpressionAttributeValues: {":country": "United States"},
    KeyConditionExpression: "country = :country"
  }
  const dbResult = await dbClient.query(params).promise()
  logger.info(`Response from db: ${JSON.stringify(dbResult)}`)
  return dbResult.Items as Vendor[]
}
