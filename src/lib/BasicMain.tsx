import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useRoutes, Link } from 'react-router-dom'

import {
  Box,
  Container
} from '@mui/material'

import { Gubu } from 'gubu'

import { BasicLed } from './BasicLed'


const CMPNAME = 'BasicSide'
console.log(CMPNAME,'1')


const { Child, Open } = Gubu
const BasicMainSpecShape = Gubu({
  main: {
    name: String,
    active: Boolean,
  
    view: {
      default: String
    }
  },

  view: Child(Open({
    kind: String
  })),
  
  mui: {
    Box: {},
    Container: {},
  }
})



function BasicMain (props: any) {
  const { ctx, spec } = props
  const { seneca, cmp } = ctx()

  const basicMainSpec = BasicMainSpecShape(spec)

  const mode = useSelector((state:any)=>state.main.nav.mode)
  const viewName = useSelector((state:any)=>state.main.current.view)
  const params: any = useParams()

  if(viewName !== params.view) {
    seneca.act('aim:app,set:view', {view: params.view})
  }

  // const viewMap = model.app.web.frame.private.view
  const viewSpec = basicMainSpec.view[viewName]
  const kind = viewSpec?.kind

  // console.log(CMPNAME, 'view', params, viewSpec)
  
  const View =
    'custom' === kind ? cmp[viewSpec.cmp] :
    'led' === kind ? BasicLed :
    ()=><div>LOADING</div>
  
  
  return (
    <Box
      className='vxg-BasicMain'
      {...basicMainSpec.mui.Box}
      sx={(theme:any)=>({
        // TODO: should use actual toolbar height; 16 should be from standard spacing
        marginTop: (theme.mixins.toolbar.minHeight+38)+'px',
        marginLeft: 'shown' === mode ? 'var(--vxg-side-width)' : 0,
        marginBottom: 0,
        marginRight: 0,
      })}
    >
      <Container
        {...basicMainSpec.mui.Container}
      >
        { View && <View ctx={ctx} spec={viewSpec} /> }
      </Container>
    </Box>
  )
}

export {
  BasicMain
}
