import { APIGatewayProxyHandler } from 'aws-lambda'
import { getTodoItems } from '../lib/dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { successResponse } from '../lib/utils/responses'
import middy from '@middy/core'
import { errorHandler } from '../lib/middleware/error-handler'
import { BadRequestError, NotFoundError } from '../lib/errors'

export const searchTodos: APIGatewayProxyHandler = async (event) => {
  const queryParameters = event.queryStringParameters
  if (!queryParameters) {
    throw new BadRequestError('Query parameter "query" is missing')
  }

  const { query } = queryParameters

  const foundTodos = await getTodoItems({
    query,
  })

  if (foundTodos.result.Items?.length === 0) {
    throw new NotFoundError('No results found')
  }

  return successResponse(
    foundTodos.result.Items?.map((item) => unmarshall(item)),
    200,
  )
}

export const handler = middy(searchTodos).use(errorHandler())
