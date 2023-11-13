import { Box, Stack } from '@mui/material'
import ExampleCard from './ExampleCard'
import { Padding } from '@mui/icons-material'

const ExampleLedHead = () => {
  return (
    <Box sx={{ marginBottom: '2rem' }}>
      <Stack direction='row' justifyContent='space-between' spacing={2}>
        <ExampleCard />
        <ExampleCard />
        <ExampleCard />
      </Stack>
    </Box>
  )
}

export default ExampleLedHead
