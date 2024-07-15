import React, { useEffect } from 'react'

import { Box } from '@mui/material'

import type { Spec } from './basic-types'

import { Gubu } from 'gubu'

const CMPNAME = 'BasicLedFoot'


const { Open } = Gubu
const BasicLedFootSpecShape = Gubu(Open({
}), {name: CMPNAME})


function BasicLedFoot (props: any) {
  const { ctx, spec } = props
  const { seneca, model } = ctx()

  const BasicEntityFootSpec: Spec = BasicLedFootSpecShape(spec)
  
  return (
    <Box className="bxg-BasicLedFoot">
      BasicEntityFoot
    </Box>
  )
}

export {
  BasicLedFoot
}
