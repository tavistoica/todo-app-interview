import { APIGatewayProxyHandler } from 'aws-lambda'
import { getTodoItem } from '../lib/dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { successResponse } from '../lib/utils/responses'
import middy from '@middy/core'
import { errorHandler } from '../lib/middleware/error-handler'
import { BadRequestError, NotFoundError } from '../lib/errors'
export const getTodo: APIGatewayProxyHandler = async (event) => {
  if (!event.pathParameters) {
    throw new BadRequestError('Path parameters are missing')
  }

  const { id } = event.pathParameters
  if (!id) {
    throw new BadRequestError("Path parameter 'id' is missing or invalid")
  }

  const result = await getTodoItem(id)

  if (!result.Items || result.Items.length === 0) {
    throw new NotFoundError('To-do item not found')
  }

  return successResponse(unmarshall(result.Items[0]), 200)
}

export const handler = middy(getTodo).use(errorHandler())
