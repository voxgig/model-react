import React from 'react'
import Alert from '@mui/material/Alert'
import CheckIcon from '@mui/icons-material/Check'

export default function BasicAlert ({
  children,
  severity,
}: {
  children: any
  severity: 'success' | 'error' | 'warning' | 'info'
}) {
  return (
    <Alert icon={<CheckIcon fontSize='inherit' />} severity={severity}>
      {children}
    </Alert>
  )
}

export { BasicAlert }
