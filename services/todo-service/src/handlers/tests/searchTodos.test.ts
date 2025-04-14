import { handler as searchTodos } from '../searchTodos'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getTodoItems } from '../../lib/dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

jest.mock('../../lib/dynamodb', () => ({
  getTodoItems: jest.fn(),
}))
jest.mock('@aws-sdk/util-dynamodb')

const mockContext = {} as any
const mockCallback = () => {}
const mockGetTodoItems = getTodoItems as jest.MockedFunction<typeof getTodoItems>

describe('searchTodos handler', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 and results when search is successful', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({ searchString: 'test' }),
      queryStringParameters: { query: 'test' },
      requestContext: { requestId: 'test-request-id' },
    } as any

    const dynamoDbResponse = {
      Items: [
        {
          id: { S: '1' },
          task: { S: 'test task' },
          completed: { BOOL: false },
        },
      ],
      $metadata: {},
    }

    mockGetTodoItems.mockResolvedValue({
      result: dynamoDbResponse,
      hasNextPage: false,
    })

    const result = (await searchTodos(event, mockContext, mockCallback)) as APIGatewayProxyResult

    expect(result.statusCode).toBe(200)
    expect(result.body).toBe(JSON.stringify(dynamoDbResponse.Items.map((item) => unmarshall(item))))
  })

  it('should return 404 if no items found', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({ searchString: 'test' }),
      queryStringParameters: { query: 'test' },
      requestContext: { requestId: 'test-request-id' },
    } as any

    const dynamoDbResponse = { Items: [], $metadata: {} }
    mockGetTodoItems.mockResolvedValue({
      result: dynamoDbResponse,
      hasNextPage: false,
    })

    const result = (await searchTodos(event, mockContext, mockCallback)) as APIGatewayProxyResult

    expect(result.statusCode).toBe(404)
    expect(result.body).toBe(JSON.stringify({ error: 'No results found', requestId: 'test-request-id' }))
  })

  it('should return 500 if DynamoDB scan fails', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({ searchString: 'test' }),
      queryStringParameters: { query: 'test' },
      requestContext: { requestId: 'test-request-id' },
    } as any

    mockGetTodoItems.mockRejectedValue(new Error('DynamoDB scan failed'))

    const result = (await searchTodos(event, mockContext, mockCallback)) as APIGatewayProxyResult

    expect(result.statusCode).toBe(500)
    const body = JSON.parse(result.body)
    expect(body.error).toBe('DynamoDB scan failed')
  })

  it('should return 400 if query parameter is missing', async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({ searchString: 'test' }),
      requestContext: { requestId: 'test-request-id' },
    } as any

    const result = (await searchTodos(event, mockContext, mockCallback)) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    const body = JSON.parse(result.body)
    expect(body.error).toBe('Query parameter "query" is missing')
  })
})
