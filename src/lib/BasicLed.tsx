import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams, Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
// import BasicButton from './BasicButton'
// import Dinero from 'dinero.js'

import { Gubu } from 'gubu'


import type { BasicProps, Spec } from './basic-types'

import { BasicEntityList } from './BasicEntityList'
import { BasicEntityEdit } from './BasicEntityEdit'
import { BasicLedHead } from './BasicLedHead'
import { BasicLedFoot } from './BasicLedFoot'
import { BasicLoading } from './BasicLoading'

import { VxgBasicLedPlugin } from './VxgBasicLedPlugin'



const CMPNAME = 'BasicLed'
console.log(CMPNAME,'2')


// Define the shape of props.spec
const { Open } = Gubu
const BasicLedSpecShape = Gubu(Open({
  name: String,
  def: {
    ent: String,
    head: {
      active: false,
    },
    foot: {
      active: false,
    },
  },
}), {prefix: CMPNAME})

// BasicLed renders a list of entities (with BasicList) or a form to edit them (with BasicEdit)
function BasicLed (props: any) {
  const { ctx, spec } = props
  const { seneca, model } = ctx()

  const basicLedSpec: Spec = BasicLedSpecShape(spec)
  console.log(CMPNAME,basicLedSpec)
  
  const name = basicLedSpec.name
  // const canon = basicLedSpec.def.ent
  const headDef = basicLedSpec.def.head
  const footDef = basicLedSpec.def.foot

  const navigate = useNavigate()
  
  const led = useSelector((state:any)=>state.main.view[name])
  const ready = true === led.ready
  
  
  if(!ready) {
    console.log(CMPNAME,'ready', ready)
    seneca.use({
      tag: name,
      define: VxgBasicLedPlugin,
      options:{
        spec: basicLedSpec,
        navigate,
      }
    })
  }

  const subspec = seneca.export('VxgBasicLedPlugin$'+name+'/spec')
  
  return (
    ready ?
    <Box className="vxg-BasicLed">
      { headDef.active && <BasicLedHead ctx={ctx} spec={subspec.head} /> }
      <Routes>
        <Route path="/" element={<BasicEntityList ctx={ctx} spec={subspec.list} />} />
        <Route path="/edit/:item" element={<BasicEntityEdit ctx={ctx} spec={subspec.edit} />} />
        <Route path="/add" element={<BasicEntityEdit ctx={ctx} spec={subspec.edit} />} />
      </Routes>
      { footDef.active && <BasicLedFoot ctx={ctx} spec={subspec.foot} /> }
    </Box>
      :
    <BasicLoading /> 
  )
}

export {
  BasicLed
}
