import { handler as getTodos } from '../getTodos'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getTodoItems } from '../../lib/dynamodb'

jest.mock('../../lib/dynamodb', () => ({
  getTodoItems: jest.fn(),
}))

const mockGetTodoItems = getTodoItems as jest.MockedFunction<typeof getTodoItems>

const mockContext = {} as any
const dynamoDbTodoItem = { id: { S: 'test-id' }, task: { S: 'Test task' } }

describe('getTodos handler', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should retrieve to-do items successfully', async () => {
    const event: APIGatewayProxyEvent = {
      queryStringParameters: { page: '1', limit: '10' },
      requestContext: { requestId: 'test-request-id' },
    } as any

    mockGetTodoItems.mockResolvedValue({
      result: {
        Items: [dynamoDbTodoItem],
        $metadata: {},
      },
      hasNextPage: false,
    })

    const result = (await getTodos(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(200)
    expect(result.body).toBeTruthy()
  })

  it('should return 500 if getTodoItems throws an error', async () => {
    const event: APIGatewayProxyEvent = {
      queryStringParameters: { page: '1', limit: '10' },
      requestContext: { requestId: 'test-request-id' },
    } as any

    mockGetTodoItems.mockRejectedValue(new Error('Test error'))

    const result = (await getTodos(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(500)
    expect(result.body).toEqual(
      JSON.stringify({
        error: 'Test error',
        requestId: 'test-request-id',
      }),
    )
  })

  it('should default to page 1 and limit 10 if query parameters are missing', async () => {
    const event: APIGatewayProxyEvent = {
      requestContext: { requestId: 'test-request-id' },
    } as any

    mockGetTodoItems.mockResolvedValue({
      result: {
        Items: [dynamoDbTodoItem],
        $metadata: {},
      },
      hasNextPage: false,
    })

    const result = (await getTodos(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(mockGetTodoItems).toHaveBeenCalledWith({ page: 1, limit: 10 })
    expect(result.statusCode).toBe(200)
  })

  it('should return 500 if getTodoItems returns an error', async () => {
    const event: APIGatewayProxyEvent = {
      queryStringParameters: {},
      requestContext: { requestId: 'test-request-id' },
    } as any

    mockGetTodoItems.mockRejectedValue(new Error('Test error'))

    const result = (await getTodos(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(500)
    expect(result.body).toBeTruthy()
  })
})
