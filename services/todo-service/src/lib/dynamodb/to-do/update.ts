import { UpdateCommand } from '@aws-sdk/lib-dynamodb'

import { UpdateCommandOutput } from '@aws-sdk/lib-dynamodb'

import { UpdateCommandInput } from '@aws-sdk/lib-dynamodb'
import { TodoItemRequest } from '@shared/types'
import { dynamoDb, todoTableName } from '..'

export async function updateTodoItem(id: string, data: TodoItemRequest): Promise<UpdateCommandOutput> {
  const params: UpdateCommandInput = {
    TableName: todoTableName,
    Key: { id },
    UpdateExpression: 'set task = :task, completed = :completed',
    ExpressionAttributeValues: {
      ':task': data.task,
      ':completed': data.completed,
    },
    ReturnValues: 'ALL_NEW',
  }

  return dynamoDb.send(new UpdateCommand(params))
}
