import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { strict as assert } from 'assert'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

function getOptions() {
  if (process.env.IS_OFFLINE) {
    return {
      region: 'localhost',
      endpoint: 'http://localhost:8000',
      credentials: {
        accessKeyId: 'MockAccessKeyId',
        secretAccessKey: 'MockSecretAccessKey',
      },
    }
  }
  return {}
}

assert(process.env.TABLE_NAME, 'TABLE_NAME is not defined')
const todoTableName = process.env.TABLE_NAME

const dynamoDbClient = new DynamoDBClient(getOptions())
const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient)

export { dynamoDb, dynamoDbClient, todoTableName }
export * from './to-do'
