import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

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

  return new XAWS.DynamoDB.DocumentClient()
}