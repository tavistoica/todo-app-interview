import * as yup from 'yup'

export const createTodoSchema = yup.object({
  task: yup.string().strict().required('Task is required'),
  completed: yup.boolean().strict().optional(),
  image: yup.string().strict().url('Image must be a valid URL').optional(),
})
