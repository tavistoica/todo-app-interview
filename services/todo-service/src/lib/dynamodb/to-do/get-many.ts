import { DynamoDBPaginationConfiguration, paginateScan } from '@aws-sdk/client-dynamodb'
import { ScanCommandOutput } from '@aws-sdk/client-dynamodb'
import { dynamoDbClient, todoTableName } from '..'
import { ScanCommandInput } from '@aws-sdk/lib-dynamodb'
import { BadRequestError } from '../../errors/error-objects'
import { getScanPaginator } from '../paginator'

export async function getTodoItems({
  page = 1,
  limit = 100,
  query,
}: {
  page?: number
  limit?: number
  query?: string
}): Promise<{ result: ScanCommandOutput; hasNextPage: boolean }> {
  const queryProperties = {
    FilterExpression: 'contains (#task, :searchString)',
    ExpressionAttributeNames: { '#task': 'task' },
    ExpressionAttributeValues: { ':searchString': { S: query } },
  }

  const params: ScanCommandInput = {
    TableName: todoTableName,
    Limit: limit,
    ...(query ? queryProperties : {}),
  }

  const paginatorConfig: DynamoDBPaginationConfiguration = {
    client: dynamoDbClient,
    pageSize: limit,
  }

  const paginator = getScanPaginator(paginatorConfig, params)

  let currentPage = 0
  for await (const pageResult of paginator) {
    if (currentPage === page - 1) {
      const hasNextPage = !!pageResult.LastEvaluatedKey
      return { result: pageResult, hasNextPage }
    }
    currentPage++

    if (!pageResult.LastEvaluatedKey) break
  }

  throw new BadRequestError('Page number exceeds available data')
}
