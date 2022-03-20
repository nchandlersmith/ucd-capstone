const AWS = require('aws-sdk')
import { CapstoneAccount } from '../../backend/src/models/getAccountsModels'
import { PhotoData } from '../../backend/src/models/photosModels'
import { Vendor } from "../../backend/src/models/vendorModels"

const accountsTableName = 'CapstoneAccounts-dev'
const photosTableName = "Photos-dev"
const vendorsTableName = "Vendors-dev"

export async function findAllVendors() {
  return createDocumentClient().query({
    TableName: vendorsTableName,
    ExpressionAttributeValues: {
      ":country": "United States",
      ":vendorName": " "
    },
    KeyConditionExpression: "country = :country AND vendorName > :vendorName"
  }).promise()
}

export async function findAllPhotosByUserId(userId: string) {
  return createDocumentClient().query({
    TableName: photosTableName,
    ExpressionAttributeValues: {
      ":userId": userId
    },
    KeyConditionExpression: "userId = :userId"
  }).promise()
}

export async function deleteVendorByVendorName(vendorName: string) {
  return createDocumentClient().delete({
    TableName: vendorsTableName,
    Key: {
      "country": "United States",
      "vendorName": vendorName
    }
  }).promise()
}

export async function deletePhotosByUserAndPhotoIds(photoId: string, userId: string) {
  return createDocumentClient().delete({
    TableName: photosTableName,
    Key: {
      "photoId": photoId,
      "userId": userId
    }
  }).promise()
}

export async function deleteAllPhotosByUser(userId: string) {
  const dynamoResponse = await findAllPhotosByUserId(userId)
  for (const item of dynamoResponse.Items) {
    await deletePhotosByUserAndPhotoIds(item.photoId, userId)
      .catch((error: any) => console.error(`Error occurred while cleaning up dynamo${error.message}`))
  }
}

export function deleteAccountByUserAndAccountIds(accountId: string, userId: string) {
  return createDocumentClient().delete({
    TableName: accountsTableName,
    Key: {
      "userId": userId,
      "accountId": accountId
    }
  }).promise()
}

export function findAllAccountsForUserId(userId: string){
  return createDocumentClient().query({
    TableName: accountsTableName,
    ExpressionAttributeValues: {
      ':userId': userId
    },
    KeyConditionExpression: 'userId = :userId'
  }).promise()
}

export function putAccount(account: CapstoneAccount) {
  createDocumentClient().put({TableName: accountsTableName, Item: account}).promise()
}

export async function putPhoto(photo: PhotoData) {
  await createDocumentClient().put({TableName: photosTableName, Item: photo}).promise()
}

export async function putVendor(vendor: Vendor) {
  await createDocumentClient().put({TableName: vendorsTableName, Item: vendor}).promise()
}

function createDocumentClient() {
  return new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'some access key',
    secretAccessKey: 'some secret'
  });
}
