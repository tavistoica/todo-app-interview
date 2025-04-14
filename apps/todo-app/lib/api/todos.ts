import { GetTodosResponse, TodoItem, TodoItemRequest } from '@shared/types'

export async function fetchTodos(limit: number, page: number): Promise<GetTodosResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_LAMBDA_API_ENDPOINT}/todos?limit=${limit}&page=${page}`)
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}

export async function updateTodo(id: string, task: string, completed: boolean) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_LAMBDA_API_ENDPOINT}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, completed }),
  })
  if (!res.ok) throw new Error('Failed to update TODO')
  return res.json()
}

export async function createTodo(data: Omit<TodoItemRequest, 'id' | 'completed'>): Promise<TodoItem> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_LAMBDA_API_ENDPOINT}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, completed: false }),
  })

  if (!response.ok) {
    throw new Error('Failed to create todo')
  }

  return response.json()
}

export async function deleteTodo(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_LAMBDA_API_ENDPOINT}/todos/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete todo')
  return res.json()
}
