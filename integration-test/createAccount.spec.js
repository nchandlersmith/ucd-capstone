const axios = require('axios')
const AWS = require('aws-sdk')

function createDocumentClient() {
  return new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'some access key',
    secretAccessKey: 'some secret'
  });
}

const docClient = createDocumentClient()
const tableName = 'Accounts-dev'
const userId = 'Ghost Rider'

describe('create account', () => {
  const userId = 'Ghost Rider'
  const headers = {
    withCredentials: true,
    Authorization: `Bearer blarg-${userId}`
  }

  afterEach(async () => {
    const dynamoResponse = await findAllAccountsForUserId()

    for (const item of dynamoResponse.Items) {
      await deleteAllAccountsByAccountIdForUserId(item.accountId)
        .catch(error => console.log`Error occured while cleaning up dynamo: ${error.message}`)
    }

  })

  it('should create an account', async () => {
    const url = 'http://localhost:3000/dev/accounts'
    const createAccountData = {
      'accountType': 'Integration Test',
      'initialDeposit': 3145
    }

    const result = await axios.post(url, createAccountData, {headers})

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
    const expectedErrorMessage = 'Missing from body: accountType'

    const result =  await axios.post(url, createAccountData, {headers}).catch(error => error)

    const dynamoResponse = await findAllAccountsForUserId()
    expect(result.response.status).toEqual(400)
    expect(result.response.data.error).toEqual(expectedErrorMessage)
    expect(dynamoResponse.Items.length).toEqual(0)
  })

  it('should reject requests when initialDeposit is missing', async () => {
    const url = 'http://localhost:3000/dev/accounts'
    const createAccountData = {
      'accountType': 'Another integration test'
    }
    const expectedErrorMessage = 'Missing from body: initialDeposit'

    const result =  await axios.post(url, createAccountData, {headers}).catch(error => error)

    const dynamoResponse = await findAllAccountsForUserId()
    expect(result.response.status).toEqual(400)
    expect(result.response.data.error).toEqual(expectedErrorMessage)
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
