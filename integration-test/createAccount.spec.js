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
            'accountType': 'Integration Test Account',
            'initialDeposit': 3145
        }
        
        const result = await axios.post(url, createAccountData)
        
        expect(result.status).toEqual(201)
    })
    
    it('should reject requests when accountType is missing', async () => {
    const url = 'http://localhost:3000/dev/accounts'
    const createAccountData = {
        'initialDeposit': 3145
    }

    const result =  await axios.post(url, createAccountData).catch(error => error)
        
    expect(result.response.status).toEqual(400)
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
