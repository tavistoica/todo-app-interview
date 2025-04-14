import { handler as deleteTodo } from '../deleteTodo'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteTodoItem, dynamoDb } from '../../lib/dynamodb'

jest.mock('../../lib/dynamodb', () => ({
  deleteTodoItem: jest.fn(),
}))

const mockDeleteTodoItem = deleteTodoItem as jest.MockedFunction<typeof deleteTodoItem>

const mockContext = {} as any

describe('deleteTodo handler', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should delete a to-do item successfully', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { id: 'test-id' },
      requestContext: { requestId: 'test-request-id' },
    } as any

    mockDeleteTodoItem.mockResolvedValue(Promise.resolve({ $metadata: { httpStatusCode: 200 } }))

    const result = (await deleteTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(200)
    expect(result.body).toBeTruthy()
  })

  it('should return 200 even if to-do item is not found', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { id: 'non-existent-id' },
      requestContext: { requestId: 'test-request-id' },
    } as any

    mockDeleteTodoItem.mockResolvedValue(Promise.resolve({ $metadata: { httpStatusCode: 200 } }))

    const result = (await deleteTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(200)
    expect(result.body).toContain('To-do item not found')
  })

  it('should return 500 if deleteTodoItem throws an error', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { id: 'test-id' },
      requestContext: { requestId: 'test-request-id' },
    } as any

    mockDeleteTodoItem.mockRejectedValue(new Error('Test error'))

    const result = (await deleteTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(500)
    expect(result.body).toEqual(
      JSON.stringify({
        error: 'Test error',
        requestId: 'test-request-id',
      }),
    )
  })

  it('should return 400 if path parameters are missing', async () => {
    const event: APIGatewayProxyEvent = {
      requestContext: { requestId: 'test-request-id' },
    } as any

    const result = (await deleteTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toBeTruthy()
  })

  it('should return 400 if id is missing in the path parameters', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: {},
      requestContext: { requestId: 'test-request-id' },
    } as any

    const result = (await deleteTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toBeTruthy()
  })
})
