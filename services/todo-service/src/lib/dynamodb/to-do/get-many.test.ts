import { getTodoItems } from './get-many'
import { getScanPaginator } from '../paginator'

jest.mock('../paginator', () => ({
  getScanPaginator: jest.fn(),
}))

describe('getTodoItems', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('returns first page of results and indicates if there is a next page', async () => {
    const mockPage = {
      Items: [{ task: { S: 'Test task' }, completed: { BOOL: false } }],
      LastEvaluatedKey: { id: { S: '123' } },
      $metadata: {},
    }

    ;(getScanPaginator as jest.Mock).mockReturnValue(
      (async function* () {
        yield mockPage
      })(),
    )

    const result = await getTodoItems({ page: 1, limit: 10, query: 'Test' })

    expect(result).toEqual({
      result: mockPage,
      hasNextPage: true,
    })
  })

  it('returns second page correctly', async () => {
    const page1 = {
      Items: [{ task: { S: 'Task 1' } }],
      LastEvaluatedKey: { id: { S: '1' } },
      $metadata: {},
    }

    const page2 = {
      Items: [{ task: { S: 'Task 2' } }],
      $metadata: {},
    }

    ;(getScanPaginator as jest.Mock).mockReturnValue(
      (async function* () {
        yield page1
        yield page2
      })(),
    )

    const result = await getTodoItems({ page: 2, limit: 10 })

    expect(result.result).toEqual(page2)
    expect(result.hasNextPage).toBe(false)
  })

  it('throws error if requested page exceeds available data', async () => {
    const onlyPage = {
      Items: [{ task: { S: 'Only page' } }],
      $metadata: {},
    }

    ;(getScanPaginator as jest.Mock).mockReturnValue(
      (async function* () {
        yield onlyPage
      })(),
    )

    await expect(getTodoItems({ page: 3, limit: 10 })).rejects.toThrow('Page number exceeds available data')
  })
})
