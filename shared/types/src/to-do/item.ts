export interface TodoItemRequest {
  task: string
  completed: boolean
  image?: string
}

export interface TodoItem extends TodoItemRequest {
  id: string
  createdAt: string
  updatedAt: string
}
