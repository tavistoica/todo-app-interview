import { Checkbox, styled } from '@mui/material'

export const ThemedCheckbox = styled(Checkbox)(({ theme }) => {
  return {
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.dark,
    },
    '&.Mui-checked': {
      color: theme.palette.primary.main,
    },
  }
})
