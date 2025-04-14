import { Button } from '@mui/material'

import { styled } from '@mui/material'

export const ThemedButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}))
