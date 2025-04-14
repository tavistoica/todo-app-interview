import { errorHandler } from './error-handler'
import { APIGatewayProxyEvent } from 'aws-lambda'

jest.mock('aws-lambda')

describe('errorHandler middleware', () => {
  it('should handle errors and return a proper response', async () => {
    const event: APIGatewayProxyEvent = {
      requestContext: { requestId: 'test-request-id' },
    } as any
    const error: any = new Error('Test error')
    error.statusCode = 500

    const request: any = {
      error,
      event,
    } as any

    const result = await errorHandler().onError(request)

    expect(result.statusCode).toBe(500)
    expect(result.body).toBeTruthy()
    expect(JSON.parse(result.body)).toEqual({
      error: 'Test error',
      requestId: 'test-request-id',
    })
  })

  it('should use default error message if error message is not provided', async () => {
    const event: APIGatewayProxyEvent = {
      requestContext: { requestId: 'test-request-id' },
    } as any

    const error: any = new Error('') // Simulate no message or empty message

    const request: any = {
      error,
      event,
    } as any

    const result = await errorHandler().onError(request)

    expect(result.statusCode).toBe(500)
    expect(result.body).toBeTruthy()
    expect(JSON.parse(result.body)).toEqual({
      error: 'Internal Server Error', // fallback message
      requestId: 'test-request-id',
    })
  })

  it('should use default request ID if request ID is not provided', async () => {
    const event = {
      requestContext: { requestId: undefined },
    } as unknown as Partial<APIGatewayProxyEvent> as APIGatewayProxyEvent
    const error: any = new Error('Test error')
    error.statusCode = 500

    const request: any = {
      error,
      event,
    } as any

    const result = await errorHandler().onError(request)

    expect(result.statusCode).toBe(500)
    expect(result.body).toBeTruthy()
    expect(JSON.parse(result.body)).toEqual({
      error: 'Test error',
      requestId: 'unknown',
    })
  })
})
