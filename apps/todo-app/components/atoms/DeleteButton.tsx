import React from 'react'
import { Tooltip, IconButton, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface DeleteButtonProps {
  onDelete: (e: React.MouseEvent) => Promise<void>
  globalLoading: boolean
  deleteLoading: boolean
}
export default function DeleteButton({ onDelete, globalLoading, deleteLoading }: DeleteButtonProps) {
  return (
    <Tooltip title="Delete">
      <IconButton
        aria-label="delete todo"
        onClick={onDelete}
        disabled={globalLoading || deleteLoading}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
          zIndex: 1,
        }}
        size="small"
      >
        {deleteLoading ? <CircularProgress size={20} /> : <CloseIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  )
}
