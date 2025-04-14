import { APIGatewayProxyHandler } from 'aws-lambda'
import { getTodoItems } from '../lib/dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { successResponse } from '../lib/utils/responses'
import middy from '@middy/core'
import { errorHandler } from '../lib/middleware/error-handler'
import { GetTodosResponse } from '@shared/types'

export const getTodos: APIGatewayProxyHandler = async (event) => {
  const queryParams = event.queryStringParameters

  const page = queryParams?.page ? Number(queryParams.page) : 1
  const limit = queryParams?.limit ? Number(queryParams.limit) : 10

  const foundTodos = await getTodoItems({ page, limit })

  return successResponse(
    {
      todos: foundTodos.result.Items?.map((item) => unmarshall(item)),
      hasNextPage: foundTodos.hasNextPage,
    } as GetTodosResponse,
    200,
  )
}

export const handler = middy(getTodos).use(errorHandler())
