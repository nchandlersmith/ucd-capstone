const AWS = require('aws-sdk')
const axios = require('axios')

const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'some access key',
    secretAccessKey: 'some secret'
  })
const tableName = 'Accounts-dev'
const userId = 'Ghost Rider'

describe('create account', () => {

    afterEach(async () => {
        const dynamoResponse = await findAllAccountsForUserId()

        dynamoResponse.Items.forEach(async (item) => {
            await deleteAllAccountsByAccountIdForUserId(item.accountId)
                .catch(error => console.log`Error occured while cleaning up dynamo: ${error.message}`)
        });

    })

    it('should create an account', async () => {
        const url = 'http://localhost:3000/dev/accounts'
        const createAccountData = {
            'accountType': 'Integration Test',
            'initialDeposit': 3145
        }
        
        const result = await axios.post(url, createAccountData)
        const dynamoResponse = await findAllAccountsForUserId()
        
        expect(result.status).toEqual(201)
        console.log(`dynamo items: ${JSON.stringify(dynamoResponse.Items)}`)
        expect(dynamoResponse.Items.length).toEqual(1)
        expect(dynamoResponse.Items[0].accountId).toBeTruthy()
        expect(dynamoResponse.Items[0].accountType).toBe(createAccountData.accountType)
        expect(dynamoResponse.Items[0].balance).toBe(createAccountData.initialDeposit)
    })
    
    it('should reject requests when accountType is missing', async () => {
    const url = 'http://localhost:3000/dev/accounts'
    const createAccountData = {
        'initialDeposit': 3145
    }

    const result =  await axios.post(url, createAccountData).catch(error => error)
    const dynamoResponse = await findAllAccountsForUserId()
        
    expect(result.response.status).toEqual(400)
    console.log(`dynamo items: ${JSON.stringify(dynamoResponse.Items)}`)
    expect(dynamoResponse.Items.length).toEqual(0)
    })
})

function deleteAllAccountsByAccountIdForUserId(accountId) {
    return docClient.delete({
        TableName: tableName,
        Key: {
            "userId": userId,
            "accountId": accountId
        }
    }).promise()
}

function findAllAccountsForUserId() {
    return docClient.query({
        TableName: tableName,
        ExpressionAttributeValues: {
            ':userId': userId
        },
        KeyConditionExpression: 'userId = :userId'
    }).promise()
}
