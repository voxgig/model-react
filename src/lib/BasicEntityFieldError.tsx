import React from 'react'

function BasicEntityFieldError (props: any) {
  const { err } = props
  return err ? (
    <div className='vxg-BasicEntityFieldError-active'>{err.message}</div>
  ) : (
    <div className='vxg-BasicEntityFieldError-none'></div>
  )
}

export { BasicEntityFieldError }
