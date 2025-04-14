import middy from '@middy/core'
import { APIGatewayProxyHandler } from 'aws-lambda'
import { TodoItemRequest } from '@shared/types'
import { updateTodoItem } from '../lib/dynamodb'
import { getBodyData } from '../lib/api-gateway'
import { successResponse } from '../lib/utils/responses'
import { errorHandler } from '../lib/middleware/error-handler'
import { BadRequestError } from '../lib/errors'
import { updateTodoSchema, validateTodoItem } from '../lib/validation'

export const updateTodo: APIGatewayProxyHandler = async (event) => {
  const { task, completed, image } = getBodyData<TodoItemRequest>(event)

  await validateTodoItem({ task, completed, image }, updateTodoSchema)

  if (!event.pathParameters) {
    throw new BadRequestError('Path parameters are missing')
  }

  const { id } = event.pathParameters
  if (!id) {
    throw new BadRequestError("Path parameter 'id' is missing")
  }

  const result = await updateTodoItem(id, { task, completed, image })

  return successResponse(result.Attributes, 200)
}

export const handler = middy(updateTodo).use(errorHandler())
