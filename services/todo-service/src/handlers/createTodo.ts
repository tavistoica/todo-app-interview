import { APIGatewayProxyHandler } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'
import { TodoItem, TodoItemRequest } from '@shared/types'
import { createTodoItem } from '../lib/dynamodb'
import { successResponse } from '../lib/utils/responses'
import { getBodyData } from '../lib/api-gateway'
import middy from '@middy/core'
import { errorHandler } from '../lib/middleware/error-handler'
import { validateTodoItem, createTodoSchema } from '../lib/validation'

export const createTodo: APIGatewayProxyHandler = async (event) => {
  const { task, completed, image } = getBodyData<TodoItemRequest>(event)

  await validateTodoItem({ task, completed, image }, createTodoSchema)

  const currentTime = new Date().toISOString()
  const item: TodoItem = {
    id: uuidv4(),
    task,
    image,
    completed: completed ?? false,
    createdAt: currentTime,
    updatedAt: currentTime,
  }

  await createTodoItem(item)

  return successResponse(item, 201)
}

export const handler = middy(createTodo).use(errorHandler())
