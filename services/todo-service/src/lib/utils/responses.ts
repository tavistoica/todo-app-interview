export function createResponse<T>(statusCode: number, body: T, headers: Record<string, string> = {}) {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }
}

export function successResponse<T>(body: T, statusCode = 200, headers: Record<string, string> = {}) {
  return createResponse(statusCode, body, headers)
}
