import React, { useState } from 'react'
import { Container } from '@mui/material'
import { TodoItem } from '@shared/types'
import Header from '../components/organisms/Header'
import { useTodos } from '../hooks/useTodos'
import ToDoList from '../components/organisms/ToDoList'
import { useRouter } from 'next/router'
import { fetchTodos } from '../lib/api/todos'

export default function TodosPage({
  todos,
  error,
  hasNextPage,
  initialPage,
}: {
  todos: TodoItem[]
  error?: { message: string }
  hasNextPage: boolean
  initialPage: number
}) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const router = useRouter()
  const { handleCheckboxChange, handleAddTodo, loading, handleDelete } = useTodos(todos, hasNextPage)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    router.push(`/todos?page=${newPage}&limit=8`) // trigger SSR re-render
  }

  if (error) return <div>Error fetching TODOs: {error.message}</div>

  return (
    <Container>
      <Header />
      <ToDoList
        currentTodos={todos}
        handleCheckboxChange={handleCheckboxChange}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        onAddTodo={handleAddTodo}
        hasNextPage={hasNextPage}
        handleDelete={handleDelete}
      />
    </Container>
  )
}

export async function getServerSideProps({ query }: { query: { page?: string; limit?: string } }) {
  const page = parseInt(query.page || '1', 10)
  const limit = parseInt(query.limit || '8', 10)

  try {
    const { todos, hasNextPage } = await fetchTodos(limit, page)
    return {
      props: {
        todos,
        hasNextPage,
        initialPage: page,
      },
    }
  } catch (error: any) {
    return {
      props: {
        todos: [],
        hasNextPage: false,
        initialPage: page,
        error: { message: error.message },
      },
    }
  }
}
