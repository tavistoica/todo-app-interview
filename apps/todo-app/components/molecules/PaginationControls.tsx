import { Typography } from '@mui/material'
import { Box } from '@mui/material'
import { ThemedButton } from '../atoms/Button'
import React from 'react'

export default function PaginationControls({
  currentPage,
  hasNextPage,
  setCurrentPage,
}: {
  currentPage: number
  setCurrentPage: (page: number) => void
  hasNextPage: boolean
}) {
  const handlePrevious = () => {
    setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    setCurrentPage(currentPage + 1)
  }

  return (
    <Box mt={2}>
      <ThemedButton onClick={handlePrevious} variant="contained" disabled={currentPage === 1}>
        Previous
      </ThemedButton>
      <Typography variant="body1" component="span" mx={2}>
        Page {currentPage}
      </Typography>

      <ThemedButton onClick={handleNext} variant="contained" disabled={!hasNextPage}>
        Next
      </ThemedButton>
    </Box>
  )
}
