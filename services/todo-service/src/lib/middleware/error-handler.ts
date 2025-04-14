import middy from '@middy/core'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export const errorHandler = () => {
  return {
    onError: async (
      request: middy.Request<APIGatewayProxyEvent, APIGatewayProxyResult>,
    ): Promise<APIGatewayProxyResult> => {
      console.error('Caught error in middleware:', request.error)

      const statusCode = (request.error as any).statusCode ?? 500
      const message = request.error?.message?.trim() || 'Internal Server Error'
      const requestId = request.event?.requestContext?.requestId ?? 'unknown'

      request.response = {
        statusCode,
        body: JSON.stringify({
          error: message,
          requestId,
        }),
      }

      return request.response
    },
  }
}
