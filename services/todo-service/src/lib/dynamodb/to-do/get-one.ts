import { ScanCommand } from '@aws-sdk/client-dynamodb'
import { ScanCommandOutput } from '@aws-sdk/client-dynamodb'
import { dynamoDb, todoTableName } from '..'

export async function getTodoItem(id: string): Promise<ScanCommandOutput> {
  const params = {
    TableName: todoTableName,
    FilterExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': { S: id as string },
    },
  }

  return dynamoDb.send(new ScanCommand(params))
}
