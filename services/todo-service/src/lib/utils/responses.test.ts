import { createResponse, successResponse } from './responses'

describe('createResponse', () => {
  it('returns a response object with the given status code, body, and headers', () => {
    const statusCode = 200
    const body = { message: 'Hello, World!' }
    const headers = { 'Custom-Header': 'custom-value' }

    const response = createResponse(statusCode, body, headers)

    expect(response).toEqual({
      statusCode,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
  })
})

describe('successResponse', () => {
  it('returns a response object with a status code of 200, the given body, and the given headers', () => {
    const body = { message: 'Hello, World!' }
    const headers = { 'Custom-Header': 'custom-value' }

    const response = successResponse(body, 201, headers)

    expect(response).toEqual({
      statusCode: 201,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
  })

  it('returns a response object with a status code of 200 by default', () => {
    const body = { message: 'Hello, World!' }

    const response = successResponse(body)

    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })
})
