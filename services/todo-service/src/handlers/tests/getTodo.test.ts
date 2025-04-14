import { handler as getTodo } from '../getTodo'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getTodoItem } from '../../lib/dynamodb'

jest.mock('../../lib/dynamodb', () => ({
  getTodoItem: jest.fn(),
}))

const mockGetTodoItem = getTodoItem as jest.MockedFunction<typeof getTodoItem>

const mockContext = {} as any

describe('getTodo handler', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should retrieve a to-do item successfully', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { id: 'test-id' },
      requestContext: { requestId: 'test-request-id' },
    } as any

    mockGetTodoItem.mockResolvedValue({
      Items: [{ id: { S: 'test-id' }, task: { S: 'Test task' } }],
      $metadata: {},
    } as any)

    const result = (await getTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(200)
    expect(result.body).toBeTruthy()
  })

  it('should return 404 if to-do item is not found', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { id: 'non-existent-id' },
      requestContext: { requestId: 'test-request-id' },
    } as any

    mockGetTodoItem.mockResolvedValue(Promise.resolve({ Items: [], $metadata: {} } as any))

    const result = (await getTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(404)
    expect(result.body).toContain('To-do item not found')
  })

  it('should return 500 if getTodoItem throws an error', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { id: 'test-id' },
      requestContext: { requestId: 'test-request-id' },
    } as any

    mockGetTodoItem.mockRejectedValue(new Error('Test error'))

    const result = (await getTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

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

    const result = (await getTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toBeTruthy()
  })

  it('should return 400 if id is missing in the path parameters', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: {},
      requestContext: { requestId: 'test-request-id' },
    } as any

    const result = (await getTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toBeTruthy()
  })
})
