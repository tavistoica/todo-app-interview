'use client'

import { Box, Typography } from '@mui/material'
import type { TodoItem, TodoItemRequest } from '@shared/types'
import ListItem from '../molecules/ListItem'
import PaginationControls from '../molecules/PaginationControls'
import AddTodoForm from './AddTodoForm'
import { useEffect } from 'react'

interface ToDoListProps {
  currentTodos: TodoItem[]
  handleCheckboxChange: (id: string, task: string, completed: boolean) => void
  handleDelete?: (id: string) => Promise<void>
  loading: boolean
  currentPage: number
  setCurrentPage: (page: number) => void
  onAddTodo?: (todo: Omit<TodoItemRequest, 'id' | 'completed'>) => Promise<TodoItem>
  hasNextPage: boolean
}

export default function ToDoList({
  currentTodos,
  handleCheckboxChange,
  handleDelete,
  loading,
  currentPage,
  setCurrentPage,
  onAddTodo,
  hasNextPage,
}: ToDoListProps) {
  // Debug logging to track props changes
  useEffect(() => {
    console.log('ToDoList received todos:', currentTodos)
  }, [currentTodos])

  return (
    <Box>
      {onAddTodo && <AddTodoForm onAddTodo={onAddTodo} loading={loading} />}

      {currentTodos.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ my: 4 }}>
          No todos found. Add a new one to get started!
        </Typography>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
            {currentTodos.map((todo) => (
              <ListItem
                key={todo.id}
                todo={todo}
                handleCheckboxChange={handleCheckboxChange}
                handleDelete={handleDelete}
                loading={loading}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <PaginationControls currentPage={currentPage} setCurrentPage={setCurrentPage} hasNextPage={hasNextPage} />
          </Box>
        </>
      )}
    </Box>
  )
}
