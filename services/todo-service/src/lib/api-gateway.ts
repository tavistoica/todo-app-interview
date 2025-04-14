import { APIGatewayProxyEvent } from 'aws-lambda'
import { BadRequestError } from './errors/error-objects'

export function getBodyData<T>(event: APIGatewayProxyEvent): T {
  if (event.body == null) {
    throw new BadRequestError('Request body is undefined or null')
  }

  try {
    return JSON.parse(event.body)
  } catch (e) {
    throw new BadRequestError('Invalid JSON in request body')
  }
}
