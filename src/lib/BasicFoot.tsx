import { Box, Container, Grid, Typography } from '@mui/material'
import { Gubu } from 'gubu'

// Validate spec shape with Gubu
const BasicFootSpecShape = Gubu({
  foot: {
    title: String
  },
  view: {}
})

function BasicFoot (props: any) {
  const { vxg, ctx } = props
  const model = ctx().model

  const basicFootSpec = BasicFootSpecShape(props.spec)

  console.log('basicFootSpec: ', basicFootSpec)

  const part = basicFootSpec.foot

  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        borderTop: '1px solid #CCC'
      }}
    >
      <Container maxWidth='lg'>
        <Grid container direction='column'>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <Typography color='#CCC' variant='body2'>
              {part.title}
            </Typography>
          </Grid>
          {/*
          <Grid item xs={12}>
            <Typography color="textSecondary" variant="subtitle1">
              {`${new Date().getFullYear()} | React | Material UI | React Router`}
            </Typography>
          </Grid>
           */}
        </Grid>
      </Container>
    </Box>
  )
}

export default BasicFoot
