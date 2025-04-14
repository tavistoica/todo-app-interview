'use client'

import type React from 'react'
import { useState } from 'react'
import { Box, TextField, Paper, Typography } from '@mui/material'
import { ThemedButton } from '../atoms/Button'
import type { TodoItem, TodoItemRequest } from '@shared/types'

interface AddTodoFormProps {
  onAddTodo: (todo: Omit<TodoItemRequest, 'id' | 'completed'>) => Promise<TodoItem>
  loading: boolean
}

export default function AddTodoForm({ onAddTodo, loading }: AddTodoFormProps) {
  const [task, setTask] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState({ task: false, imageUrl: false })

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value)
    if (e.target.value) setError((prev) => ({ ...prev, task: false }))
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
    if (e.target.value) setError((prev) => ({ ...prev, imageUrl: false }))
  }

  const handlePreview = () => {
    if (imageUrl) {
      setPreviewUrl(imageUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newError = {
      task: !task,
      imageUrl: !imageUrl,
    }

    setError(newError)

    if (newError.task || newError.imageUrl) return

    console.log(
      {
        task,
        image: imageUrl,
      },
      'test',
    )
    await onAddTodo({
      task,
      image: imageUrl,
    })

    setTask('')
    setImageUrl('')
    setPreviewUrl('')
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Add New Todo
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              label="Task Name"
              value={task}
              onChange={handleTaskChange}
              margin="normal"
              error={error.task}
              helperText={error.task ? 'Task name is required' : ''}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Image URL"
              value={imageUrl}
              onChange={handleImageUrlChange}
              margin="normal"
              error={error.imageUrl}
              helperText={error.imageUrl ? 'Image URL is required' : ''}
              disabled={loading}
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <ThemedButton
                type="button"
                variant="contained"
                color="secondary"
                onClick={handlePreview}
                disabled={!imageUrl || loading}
                sx={{
                  fontWeight: 'medium',
                  '&.Mui-disabled': {
                    opacity: 0.7,
                    color: 'white',
                  },
                }}
              >
                Preview Image
              </ThemedButton>

              <ThemedButton type="submit" variant="contained" disabled={loading}>
                {loading ? 'Adding...' : 'Add Todo'}
              </ThemedButton>
            </Box>
          </Box>

          <Box sx={{ flex: 1 }}>
            {previewUrl && (
              <Box
                sx={{
                  width: '100%',
                  height: '200px',
                  backgroundImage: `url(${previewUrl})`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            )}
            {!previewUrl && (
              <Box
                sx={{
                  width: '100%',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed #ccc',
                  borderRadius: '4px',
                  bgcolor: '#f5f5f5',
                }}
              >
                <Typography color="textSecondary">Image preview will appear here</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </form>
    </Paper>
  )
}
