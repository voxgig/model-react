import { Box, Stack } from '@mui/material'
import ExampleCard from './ExampleCard'
import { Padding } from '@mui/icons-material'

const ExampleLedFoot = () => {
  return (
    <Box sx={{ marginY: '2rem' }}>
      <Stack direction='row' justifyContent='space-between' spacing={2}>
        <ExampleCard />
      </Stack>
    </Box>
  )
}

export default ExampleLedFoot
