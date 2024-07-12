import React, { useEffect } from 'react'

import { useSelector } from 'react-redux'

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


const { Open, Child } = Gubu
const BasicLedHeadSpecShape = Gubu(Open({
  tool: Child({
    id: String,
    kind: String,
    custom: '',
  },{}),
  mui: Open({
    Toolbar: Open({})
  })
}), {name: CMPNAME})


function BasicLedHead (props: any) {
  const { ctx, spec } = props
  const { seneca, custom } = ctx()

  let navigate = useNavigate()
  let loc = useLocation()

  const BasicEntityHeadSpec: Spec = BasicLedHeadSpecShape(spec)
  console.log(CMPNAME,BasicEntityHeadSpec)
  const viewName = BasicEntityHeadSpec.name
  
  const name = spec.name
  const slotName = spec.prefix+spec.name

  const slotSelectors = seneca.export('Redux/slotSelectors')
  const { selectItem, selectMeta } = slotSelectors(slotName)

  const item = useSelector((state:any)=>selectItem(state))
  const viewState = useSelector((state:any)=>state.main.view[viewName])

  const state = { item, view:viewState, navigate }
  console.log(CMPNAME,'state',slotName,state)
  
  const subview = '/view/'+viewName === loc.pathname ? 'list' : 'edit'
  // console.log('LOC', location, subview, item)

  const customButtons = Object.values(spec.tool || {})
    .filter((t:any)=>'button'===t.kind)
    .map((t:any)=>(custom.BasicLedHead||{})[t.custom])
    .filter((t:any)=>null!=t)
  console.log('CB', customButtons)
    
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
          onClick={()=>seneca.act('aim:app,on:view,add:item',{view:viewName})}
          disabled={'edit'===subview}
        >Add</Button>

        { customButtons.map(cb=>
          <Button
            key={cb.id}
            color="inherit"
            onClick={()=>seneca.act(cb.msg(state,spec,ctx))}
            disabled={cb.disabled(state,spec,ctx)}
            {...cb.attr(state,spec,ctx)}
          >{cb.title(state,spec,ctx)}</Button>
        ) }
        
      </Toolbar>
    </Box>
  )
}

export {
  BasicLedHead
}
