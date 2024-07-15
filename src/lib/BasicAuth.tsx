import React, {
  // useCallback,
  useState,
  useEffect, 
} from 'react'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert'

import { VxgBasicAuthPlugin } from './VxgBasicAuthPlugin'



function BasicAuth (props: any) {
  const { spec, ctx } = props
  const { seneca } = ctx()

  const [ready, setReady] = useState(false)
  const [signinStatus, setSigninStatus] = useState('none')


  useEffect(()=>{
    if(!ready) {
      seneca
        .use(VxgBasicAuthPlugin,{setSigninStatus, setReady, spec})
    }
  },[])

  const handleSignin = seneca.export('VxgBasicAuthPlugin/handleSignin') || (()=>{})  

  
  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >

        <img style={{ width: 400 }} src={spec.img.logo} />

        <Typography
          sx={{ mt: 4, color: 'primary.main' }}
          variant='h3'
        >
          {spec.title}
        </Typography>

        <Box
          component='form'
          onSubmit={handleSignin}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
          />

          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>


          { 'invalid' == signinStatus &&
            <Alert severity="warning">Invalid email or password</Alert> }

          { 'debug' == signinStatus && 
            <Alert severity="warning">Signin debug</Alert> }

          { 'unavailable' == signinStatus &&
            <Alert severity="error">Signin unavailable</Alert> }
          
          {/*
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
      </Grid>
           */}

          <div><br /><br /><br /><br /></div>
        </Box>
      </Box>
    </Container>
  )
}

export default BasicAuth
