import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { dynamoDb, todoTableName } from '..'
import { TodoItemRequest } from '@shared/types'

export async function createTodoItem(todoData: TodoItemRequest): Promise<void> {
  const params: PutCommandInput = {
    TableName: todoTableName as string,
    Item: todoData,
    ConditionExpression: 'attribute_not_exists(id)',
  }

  try {
    await dynamoDb.send(new PutCommand(params))
  } catch (error: any) {
    console.error('Error creating to-do item in dynamoDB', error)
    throw new Error('Could not create to-do item in dynamoDB')
  }
}
