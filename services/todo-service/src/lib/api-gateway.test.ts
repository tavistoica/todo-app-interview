import { getBodyData } from './api-gateway'
import { APIGatewayProxyEvent } from 'aws-lambda'

describe('getBodyData', () => {
  it('returns the parsed JSON body', () => {
    const event = {
      body: '{"key": "value"}',
    } as Partial<APIGatewayProxyEvent> as APIGatewayProxyEvent

    const result = getBodyData(event)

    expect(result).toEqual({ key: 'value' })
  })

  it('throws an error if the request body is undefined or null', () => {
    const event = {
      body: undefined,
    } as Partial<APIGatewayProxyEvent> as APIGatewayProxyEvent

    expect(() => getBodyData(event)).toThrow('Request body is undefined or null')
  })

  it('throws an error if the request body is not valid JSON', () => {
    const event = {
      body: 'invalid JSON',
    } as Partial<APIGatewayProxyEvent> as APIGatewayProxyEvent

    expect(() => getBodyData(event)).toThrow('Invalid JSON in request body')
  })
})
