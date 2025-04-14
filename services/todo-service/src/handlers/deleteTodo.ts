import { APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodoItem } from '../lib/dynamodb'
import { successResponse } from '../lib/utils/responses'
import middy from '@middy/core'
import { errorHandler } from '../lib/middleware/error-handler'
import { BadRequestError } from '../lib/errors'
export const deleteTodo: APIGatewayProxyHandler = async (event) => {
  if (!event.pathParameters) {
    throw new BadRequestError('Path parameters are missing')
  }

  const { id } = event.pathParameters
  if (!id) {
    throw new BadRequestError("Path parameter 'id' is missing or invalid")
  }

  const deleteItemResponse = await deleteTodoItem(id)

  const responseMessage = deleteItemResponse.Attributes ? 'To-do item deleted successfully' : 'To-do item not found'

  return successResponse(responseMessage, 200)
}

export const handler = middy(deleteTodo).use(errorHandler())
