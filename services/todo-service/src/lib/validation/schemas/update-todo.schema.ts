import * as yup from 'yup'

export const updateTodoSchema = yup
  .object({
    task: yup.string().strict().optional(),
    completed: yup.boolean().strict().optional(),
    image: yup.string().strict().url('Image must be a valid URL').optional(),
  })
  .test('at-least-one', 'At least one of task, completed, or image must be present', function (data) {
    return data.task !== undefined || data.completed !== undefined || data.image !== undefined
  })
