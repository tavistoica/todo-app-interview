'use client'

import type React from 'react'

import { Box, ListItemText, Paper, ListItem as MuiListItem, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { ThemedCheckbox } from '../atoms/Checkbox'
import type { TodoItem } from '@shared/types'
import DeleteButton from '../atoms/DeleteButton'

interface ListItemProps {
  todo: TodoItem
  handleCheckboxChange: (id: string, task: string, completed: boolean) => void
  handleDelete?: (id: string) => Promise<void>
  loading: boolean
}

export default function ListItem({ todo, handleCheckboxChange, handleDelete, loading: globalLoading }: ListItemProps) {
  const [localLoading, setLocalLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [localCompleted, setLocalCompleted] = useState(todo.completed)

  const handleChange = async () => {
    setLocalLoading(true)
    try {
      await handleCheckboxChange(todo.id, todo.task, localCompleted)
      setLocalCompleted(!localCompleted)
    } catch (error) {
      console.error('Error updating todo:', error)
    } finally {
      setLocalLoading(false)
    }
  }

  const onDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!handleDelete) return

    setDeleteLoading(true)
    try {
      await handleDelete(todo.id)
    } catch (error) {
      console.error('Error deleting todo:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%', xl: '25%' }, padding: 1.5, boxSizing: 'border-box' }}>
      <Paper elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {handleDelete && (
          <DeleteButton onDelete={onDelete} globalLoading={globalLoading} deleteLoading={deleteLoading} />
        )}

        <Box
          sx={{
            width: '100%',
            height: '200px',
            backgroundImage: `url(${todo.image})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        ></Box>
        <MuiListItem sx={{ flexGrow: 1 }}>
          {localLoading ? (
            <CircularProgress size={24} sx={{ mr: 2 }} />
          ) : (
            <ThemedCheckbox checked={localCompleted} onChange={handleChange} disabled={globalLoading} />
          )}
          <ListItemText
            primary={todo.task}
            secondary={localCompleted ? 'Completed' : 'Pending'}
            sx={{
              '& .MuiListItemText-primary': {
                textDecoration: localCompleted ? 'line-through' : 'none',
                color: localCompleted ? 'text.secondary' : 'text.primary',
              },
            }}
          />
        </MuiListItem>
      </Paper>
    </Box>
  )
}
