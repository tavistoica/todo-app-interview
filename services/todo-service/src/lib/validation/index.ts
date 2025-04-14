import { BadRequestError } from '../errors/error-objects'
import * as yup from 'yup'

export * from './schemas/create-todo.schema'
export * from './schemas/update-todo.schema'

export const validateTodoItem = async (data: any, schema: yup.ObjectSchema<any>) => {
  try {
    await schema.validate(data, { abortEarly: false })
  } catch (err) {
    const message = err instanceof yup.ValidationError ? err.errors.join(', ') : 'Invalid input'
    throw new BadRequestError(message)
  }
}
