const AWS = require('aws-sdk')
const axios = require('axios')

const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'some access key',
    secretAccessKey: 'some secret'
  })
const tableName = 'Accounts-dev'

describe('create account', () => {
    it('should create an account', async () => {
        const url = 'http://localhost:3000/dev/accounts'
        const createAccountData = {
            'accountType': 'Integration Test Account',
            'initialDeposit': 3145
        }

        const result = await axios.post(url, createAccountData)
        const dynamoItems = await docClient.query({
            TableName: tableName,
            ExpressionAttributeValues: {
                ':userId': 'Ghost Rider'
            },
            KeyConditionExpression: 'userId = :userId'
        }).promise()

        console.log(`items: ${JSON.stringify(dynamoItems.Items)}`)
        console.log(`the thing: ${dynamoItems.Items[0].userId}`)
        console.log(`number of things: ${dynamoItems.Items.length}`)

        expect(result.status).toEqual(201)
        
        await docClient.delete({
            TableName: tableName,
            Key: {
                "userId": dynamoItems.Items[0].userId,
                "accountId": dynamoItems.Items[0].accountId
            }
        }).promise()

    })
})