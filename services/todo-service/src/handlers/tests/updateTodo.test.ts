import { handler as updateTodo } from '../updateTodo'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { updateTodoItem } from '../../lib/dynamodb'

jest.mock('../../lib/dynamodb', () => ({
  updateTodoItem: jest.fn(),
}))

const mockUpdateTodoItem = updateTodoItem as jest.MockedFunction<typeof updateTodoItem>

const mockContext = {} as any
const dynamoDbTodoItem = { id: { S: 'test-id' }, task: { S: 'Test task' } }

describe('updateTodo handler', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should update to-do item successfully', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { id: 'test-id' },
      body: JSON.stringify({ task: 'Updated task' }),
      requestContext: { requestId: 'test-request-id' },
    } as any

    mockUpdateTodoItem.mockResolvedValue({
      Attributes: dynamoDbTodoItem,
      $metadata: {},
    } as any)

    const result = (await updateTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(200)
    expect(result.body).toBeTruthy()
  })

  it('should return 400 if validation fails', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { id: 'test-id' },
      body: JSON.stringify({}),
      requestContext: { requestId: 'test-request-id' },
    } as any

    const result = (await updateTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual(
      JSON.stringify({
        error: 'At least one of task, completed, or image must be present',
        requestId: 'test-request-id',
      }),
    )
  })

  it('should return 400 if path parameter id is missing', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { random: 'test-random' },
      body: JSON.stringify({ task: 'Updated task' }),
      requestContext: { requestId: 'test-request-id' },
    } as any

    const result = (await updateTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual(
      JSON.stringify({
        error: "Path parameter 'id' is missing",
        requestId: 'test-request-id',
      }),
    )
  })

  it('should return 400 if pathParameters is missing', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({ task: 'Updated task' }),
      requestContext: { requestId: 'test-request-id' },
    } as any

    const result = (await updateTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual(JSON.stringify({ error: 'Path parameters are missing', requestId: 'test-request-id' }))
  })

  it('should return 500 if updateTodoItem throws an error', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { id: 'test-id' },
      body: JSON.stringify({ task: 'Updated task' }),
      requestContext: { requestId: 'test-request-id' },
    } as any

    mockUpdateTodoItem.mockRejectedValue(new Error('Test error'))

    const result = (await updateTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(500)
    expect(result.body).toEqual(
      JSON.stringify({
        error: 'Test error',
        requestId: 'test-request-id',
      }),
    )
  })
})
