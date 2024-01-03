import React, { useCallback, useState } from 'react'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert'



console.log('BasicAuth 1')


function BasicAuth (props: any) {
  const { spec, ctx } = props
  const seneca = ctx().seneca

  const [signinStatus, setSigninStatus] = useState('none')
  
  const handleSignin = useCallback((event:any)=>{
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const email = data.get('email')
    const password = data.get('password')
    
    seneca.act(
      'aim:req,on:auth,signin:user',
      { email, password },
      function (err: any, out: any) {
        if (null == err && null != out && out.ok && !spec.signin.debug) {
          document.location.href = document.location.origin +
            '/view/'+spec.signin.view
          return
        }

        else if(null == err && !out.ok) {
          setSigninStatus('invalid')
          return
        }

        else if(null == err && out.ok && spec.signin.debug) {
          setSigninStatus('debug')
          return
        }

        if(null != err ) {
          console.warn('BasicAuth', 'signin', email, err)
        }

        setSigninStatus('unavailable')
      }
    )

  },[])
  

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
