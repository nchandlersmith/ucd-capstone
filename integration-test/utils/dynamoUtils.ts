const AWS = require('aws-sdk')
import { CapstoneAccount } from '../../backend/src/models/getAccountsModels'

const accountsTableName = 'CapstoneAccounts-dev'

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

export function putAccountInDynamo(account: CapstoneAccount) {
  createDocumentClient().put({TableName: accountsTableName, Item: account}).promise()
}

function createDocumentClient() {
  return new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'some access key',
    secretAccessKey: 'some secret'
  });
}
