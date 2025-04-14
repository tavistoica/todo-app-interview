import { dynamoDb, todoTableName } from '..'
import { DeleteCommand, DeleteCommandInput, DeleteCommandOutput } from '@aws-sdk/lib-dynamodb'

export async function deleteTodoItem(id: string): Promise<DeleteCommandOutput> {
  const params: DeleteCommandInput = {
    TableName: todoTableName,
    Key: {
      id: id,
    },
    ReturnValues: 'ALL_OLD',
  }

  const deleteCommand = new DeleteCommand(params)
  return dynamoDb.send(deleteCommand)
}
