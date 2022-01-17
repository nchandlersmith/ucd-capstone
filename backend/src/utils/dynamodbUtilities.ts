import AWS from "aws-sdk"

export function createDynamoDBClient() {
  const isDynamoDBLocal = process.env.LOCAL_DYNAMODB

  if (isDynamoDBLocal) {
    console.log('Using local DynamoDB client')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
      accessKeyId: 'some access key',
      secretAccessKey: 'some secret'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}