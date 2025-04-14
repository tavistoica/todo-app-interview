import { validateTodoItem } from './index'
import { createTodoSchema } from './schemas/create-todo.schema'
import { BadRequestError } from '../errors/error-objects'

describe('validateTodoItem', () => {
  it('should validate a valid todo item for create', async () => {
    const data = { task: 'Test task', completed: false }
    await expect(validateTodoItem(data, createTodoSchema)).resolves.not.toThrow()
  })

  it('should throw an error for an invalid todo item for create', async () => {
    const data = { task: 123, completed: 'invalid' }
    await expect(validateTodoItem(data, createTodoSchema)).rejects.toThrow(BadRequestError)
  })

  it('should throw an error for a todo item with missing required fields for create', async () => {
    const data = { completed: false }
    await expect(validateTodoItem(data, createTodoSchema)).rejects.toThrow(BadRequestError)
  })
})
