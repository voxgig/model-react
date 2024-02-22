import React, { useEffect } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'


import {
  Box,
  Toolbar,
  Button,
} from '@mui/material'

import type { Spec } from './basic-types'

import { Gubu } from 'gubu'

const CMPNAME = 'BasicLedHead'
console.log(CMPNAME,'1')


const { Open } = Gubu
const BasicLedHeadSpecShape = Gubu(Open({
  mui: Open({
    Toolbar: Open({})
  })
}), {prefix: CMPNAME})


function BasicLedHead (props: any) {
  const { ctx, spec } = props
  const { seneca, model } = ctx()

  const BasicEntityHeadSpec: Spec = BasicLedHeadSpecShape(spec)
  console.log(CMPNAME,BasicEntityHeadSpec)
  const viewName = BasicEntityHeadSpec.name
  
  let navigate = useNavigate()
  let loc = useLocation()

  const subview = '/view/'+viewName === loc.pathname ? 'list' : 'edit'
  console.log('LOC', location, subview)
  
  return (
    <Box className="bxg-BasicLedHead">
      <Toolbar
        className="vxg-BasicLedHead-toolbar"
        variant="dense"
      >
        <Button
          color="inherit"
          onClick={()=>navigate(-1)}
          disabled={'list'===subview}
        >Back</Button>
        <Button
          color="inherit"
          onClick={()=>seneca.act('aim:app,on:view,add:item',{view:'track'})}
          disabled={'edit'===subview}
        >Add</Button>
      </Toolbar>
    </Box>
  )
}

export {
  BasicLedHead
}
