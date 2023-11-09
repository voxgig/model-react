import { Box, Stack } from '@mui/material'
import BasicCard from './BasicCard'
import { Padding } from '@mui/icons-material'

const BasicLedHead = () => {
  return (
    <Box sx={{ marginBottom: '2rem' }}>
      <Stack direction='row' justifyContent='space-between' spacing={2}>
        <BasicCard />
        <BasicCard />
        <BasicCard />
      </Stack>
    </Box>
  )
}

export default BasicLedHead
