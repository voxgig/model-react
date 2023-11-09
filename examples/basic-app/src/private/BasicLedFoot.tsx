import { Box, Stack } from '@mui/material'
import BasicCard from './BasicCard'
import { Padding } from '@mui/icons-material'

const BasicLedFoot = () => {
  return (
    <Box sx={{ marginY: '2rem' }}>
      <Stack direction='row' justifyContent='space-between' spacing={2}>
        <BasicCard />
      </Stack>
    </Box>
  )
}

export default BasicLedFoot
