import { handler as createTodo } from '../createTodo'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { dynamoDb } from '../../lib/dynamodb'

jest.mock('../../lib/dynamodb')
const mockContext = {} as any

describe('createTodo handler', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a to-do item successfully', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({ task: 'Test task' }),
      requestContext: { requestId: 'test-request-id' },
    } as any

    dynamoDb.send = jest.fn().mockResolvedValue({})

    const result = (await createTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(201)
    expect(result.body).toBeTruthy()
  })

  it('should return 400 if request body is missing', async () => {
    const event: APIGatewayProxyEvent = {
      body: null,
      requestContext: { requestId: 'test-request-id' },
    } as any

    const result = (await createTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toBeTruthy()
  })

  it('should return 400 if JSON is invalid', async () => {
    const event: APIGatewayProxyEvent = {
      body: '{invalidJson}',
      requestContext: { requestId: 'test-request-id' },
    } as any

    const result = (await createTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toBeTruthy()
  })

  it('should return 400 if validation fails', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({}),
      requestContext: { requestId: 'test-request-id' },
    } as any

    const result = (await createTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toBeTruthy()
  })

  it('should return 400 if "completed" is not a boolean in the request body, so what validation will fail', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({ task: 'Test task', completed: 'true' }),
      requestContext: { requestId: 'test-request-id' },
    } as any

    const result = (await createTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toBeTruthy()
  })

  it('should return 400 if image is not a string in the request body', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({ task: 'Test task', image: 123 }),
      requestContext: { requestId: 'test-request-id' },
    } as any

    const result = (await createTodo(event as any, mockContext, () => {})) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toBeTruthy()
  })
})
