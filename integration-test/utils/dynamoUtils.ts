const AWS = require('aws-sdk')
import { CapstoneAccount } from '../../backend/src/models/getAccountsModels'
import { PhotoDao } from '../../backend/src/models/photosModels'

const accountsTableName = 'CapstoneAccounts-dev'
const photosTableName = "Photos-dev"

export async function findAllPhotosByUserId(userId: string) {
  return createDocumentClient().query({
    TableName: photosTableName,
    ExpressionAttributeValues: {
      ":userId": userId
    },
    KeyConditionExpression: "userId = :userId"
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

export async function putPhoto(photo: PhotoDao) {
  await createDocumentClient().put({TableName: photosTableName, Item: photo}).promise()
}

function createDocumentClient() {
  return new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'some access key',
    secretAccessKey: 'some secret'
  });
}
