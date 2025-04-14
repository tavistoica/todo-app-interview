'use client'

import { useState, useCallback, useEffect } from 'react'
import type { TodoItem, TodoItemRequest } from '@shared/types'
import { fetchTodos, updateTodo, createTodo, deleteTodo } from '../lib/api/todos'

export function useTodos(initialTodos: TodoItem[], initialHasNextPage: boolean) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const ITEMS_PER_PAGE = 8

  const fetchTodosForPage = useCallback(async (page: number) => {
    setLoading(true)
    try {
      const response = await fetchTodos(ITEMS_PER_PAGE, page)
      setTodos(response.todos)
      setHasNextPage(response.hasNextPage)
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTodosForPage(currentPage)
  }, [currentPage, fetchTodosForPage])

  const handleCheckboxChange = useCallback(async (id: string, task: string, completed: boolean) => {
    try {
      // Make API call to update the todo
      await updateTodo(id, task, !completed)

      // Update the local state with the updated todo
      setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo)))
    } catch (error) {
      console.error('Error updating todo:', error)
      throw error
    }
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteTodo(id)

        // Remove the deleted todo from the local state
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))

        // Always refetch the current page to ensure we have the correct items
        await fetchTodosForPage(currentPage)
      } catch (error) {
        console.error('Error deleting todo:', error)
        throw error
      }
    },
    [currentPage, fetchTodosForPage],
  )

  const handleAddTodo = useCallback(
    async (newTodo: Omit<TodoItemRequest, 'id' | 'completed'>): Promise<TodoItem> => {
      setLoading(true)
      try {
        const createdTodo = await createTodo(newTodo)

        // After creating a new todo, fetch the first page to show the new item
        setCurrentPage(1)
        await fetchTodosForPage(1)

        return createdTodo
      } catch (error) {
        console.error('Error creating todo:', error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [fetchTodosForPage],
  )

  return {
    todos,
    setTodos,
    currentTodos: todos,
    currentPage,
    setCurrentPage,
    handleCheckboxChange,
    handleDelete,
    handleAddTodo,
    loading,
    hasNextPage,
    refetchTodos: fetchTodosForPage,
  }
}
