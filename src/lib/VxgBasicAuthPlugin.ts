

import { Open } from 'gubu'


function VxgBasicAuthPlugin(this: any, options: any) {
  const seneca = this

  const { spec, setSigninStatus, setReady } = options

  console.log('VxgBasicAuthPlugin define', spec)


  function handleSignin(event: any) {
    console.log('handleSignin')
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const email = data.get('email')
    const password = data.get('password')

    seneca.delegate().act(
      'aim:req,on:auth,signin:user',
      { email, password },
      function(err: any, out: any) {
        if (null == err && null != out && out.ok && !spec.signin.debug) {
          document.location.href = document.location.origin +
            '/view/' + spec.signin.view
          return
        }

        else if (null == err && !out.ok) {
          setSigninStatus('invalid')
          return
        }

        else if (null == err && out.ok && spec.signin.debug) {
          setSigninStatus('debug')
          return
        }

        if (null != err) {
          console.warn('BasicAuth', 'signin', email, err)
        }

        setSigninStatus('unavailable')
      }
    )
  }

  setReady(true)

  return {
    exports: {
      handleSignin
    }
  }
}

VxgBasicAuthPlugin.default = {
  setSigninStatus: Function,
  setReady: Function,
  spec: Open({
    signin: Open({
      debug: false
    })
  })
}


Object.defineProperty(VxgBasicAuthPlugin, 'name', { value: 'VxgBasicAuthPlugin' })

export {
  VxgBasicAuthPlugin
}
