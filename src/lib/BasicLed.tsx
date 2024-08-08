import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams, Routes, Route } from 'react-router-dom'
import { Alert, Box } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'

import { Gubu } from 'gubu'

import type { BasicProps, Spec } from './basic-types'

import { BasicEntityList } from './BasicEntityList'
import { BasicEntityEdit } from './BasicEntityEdit'
import { BasicLedHead } from './BasicLedHead'
import { BasicLedFoot } from './BasicLedFoot'
import { BasicLoading } from './BasicLoading'

import { VxgBasicLedPlugin } from './VxgBasicLedPlugin'

const CMPNAME = 'BasicLed'

// BasicLed renders a list of entities (with BasicList) or a form to edit them (with BasicEdit)
function BasicLed (props: any) {
  const { ctx } = props
  const { seneca } = ctx()
  const name = props.spec.name
  const uniqueIdRef = useRef(seneca.util.Nid())
  // TODO: use uniqueIdRef.current to avoid name clashes but sort out store issues
  const cid = name // + '-' + uniqueIdRef.current
  // TODO: look into custom hook implementation useComponentId()

  const navigate = useNavigate()

  const led = useSelector((state: any) => state.main.view[name])
  const ready = true === led?.ready

  if (!ready) {
    seneca.use({
      tag: cid,
      define: VxgBasicLedPlugin,
      options: {
        spec: props.spec,
        navigate,
      },
    })
  }

  const { head, list, edit, foot } =
    seneca.export('VxgBasicLedPlugin$' + cid + '/spec') || {}

  return ready ? (
    <Box className='vxg-BasicLed'>
      {head.active && <BasicLedHead ctx={ctx} spec={head} />}
      <Routes>
        <Route path='/' element={<BasicEntityList ctx={ctx} spec={list} />} />
        <Route
          path='/edit/:item'
          element={<BasicEntityEdit ctx={ctx} spec={edit} />}
        />
        <Route
          path='/add'
          element={<BasicEntityEdit ctx={ctx} spec={edit} />}
        />
      </Routes>
      {foot.active && <BasicLedFoot ctx={ctx} spec={foot} />}
    </Box>
  ) : (
    <BasicLoading />
  )
}

export { BasicLed }
