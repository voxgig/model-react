import React from 'react'

import { Box } from '@mui/material'

import { Gubu } from 'gubu'

import type { BasicProps, Spec } from './basic-types'

import { BasicHead } from './BasicHead'

/*
import BasicSide from './BasicSide'
import BasicMain from './BasicMain'
import BasicFoot from './BasicFoot'
*/

const { Child } = Gubu


const cmpname = 'BasicAdmin'

const BasicAdminSpecShape = Gubu({
  frame: {
    name: String,
    kind: String,
    part: Child({}),
    view: Child({}),
  }
}, {prefix:cmpname})


function BasicAdmin (props: BasicProps) {
  const { ctx, spec } = props

  const basicAdminSpec: Spec = BasicAdminSpecShape(spec)

  const { head, side, main, foot } = basicAdminSpec.frame.part

  // const headSpec = { head: frameModel.part.head, view }
  // const sideSpec = { side: frameModel.part.side, view }
  // const mainSpec = { main: frameModel.part.main, view }
  // const footSpec = { foot: frameModel.part.foot, view }
  /*
        <BasicSide vxg={vxg} ctx={ctx} spec={sideSpec} />
      <BasicMain vxg={vxg} ctx={ctx} spec={mainSpec} />
      <BasicFoot vxg={vxg} ctx={ctx} spec={footSpec} />
  <BasicHead vxg={vxg} ctx={ctx} spec={headSpec} />
  
   */
  
  return (
    <Box className='vxg-BasicAdmin'>
      { head.active && <BasicHead ctx={ctx} spec={{head}} /> }
    </Box>
  )
}

export {
  BasicAdmin
}
