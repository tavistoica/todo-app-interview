import { paginateScan } from '@aws-sdk/client-dynamodb'
import type { DynamoDBPaginationConfiguration, ScanCommandInput } from '@aws-sdk/client-dynamodb'

export function getScanPaginator(config: DynamoDBPaginationConfiguration, params: ScanCommandInput) {
  return paginateScan(config, params)
}
