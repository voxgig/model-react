import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams, Routes, Route } from 'react-router-dom'
import { Box, Chip, LinearProgress, Typography } from '@mui/material'
import BasicButton from './BasicButton'
import Dinero from 'dinero.js'

import { Gubu } from 'gubu'


import type { BasicProps, Spec } from './basic-types'

import { BasicHeadTool } from './BasicHeadTool'
import { BasicList } from './BasicList'
import { BasicEdit } from './BasicEdit'
import { BasicLoading } from './BasicLoading'

import { VxgBasicLedPlugin } from './VxgBasicLedPlugin'



const CMPNAME = 'BasicLed'
console.log(CMPNAME,'2')


// Define the shape of props.spec
const { Open } = Gubu
const BasicLedSpecShape = Gubu(Open({
  name: String
}), {prefix: CMPNAME})

// BasicLed renders a list of entities (with BasicList) or a form to edit them (with BasicEdit)
function BasicLed (props: any) {
  const { ctx, spec } = props
  const { seneca, model } = ctx()

  const basicLedSpec: Spec = BasicLedSpecShape(spec)
  console.log(CMPNAME,basicLedSpec)
  
  const name = basicLedSpec.name
  const canon = basicLedSpec.spec.ent

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

  const listSpec = {
    name,
    ent: canon,
    prefix: 'BasicLed_',
  }
  
  const editSpec = {
    name,
    ent: canon,
    prefix: 'BasicLed_',
  }

  return (
    ready ?
    <Box className="vxg-BasicLed">
      <Routes>
        <Route path="/" element={<BasicList ctx={ctx} spec={listSpec} />} />
        <Route path="/edit/:item" element={<BasicEdit ctx={ctx} spec={editSpec} />} />
      </Routes>
    </Box>
      :
    <BasicLoading /> 
  )
}

export {
  BasicLed
}
