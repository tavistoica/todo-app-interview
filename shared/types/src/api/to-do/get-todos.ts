import { TodoItem } from '../..'

export interface GetTodosRequest {
  page?: number
  limit?: number
}

export interface GetTodosResponse {
  todos: TodoItem[]
  hasNextPage: boolean
}
