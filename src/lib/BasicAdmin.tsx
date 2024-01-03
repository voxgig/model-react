import React, { useEffect, useState } from 'react'


import { Box } from '@mui/material'

import { Gubu } from 'gubu'

import type { BasicProps, Spec } from './basic-types'

import { BasicHead } from './BasicHead'
import { BasicMain } from './BasicMain'
import { BasicSide } from './BasicSide'

/*


import BasicFoot from './BasicFoot'
*/


console.log('BasicAdmin 1')

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


function Loading() {
  return <div>LOADING</div>
}


function BasicAdmin (props: BasicProps) {
  const { ctx, spec } = props
  const { seneca } = ctx()

  const [ready, setReady] = useState('init')
  
  useEffect(()=>{
    if('init' !== ready) {
      return
    }
    init(seneca, ()=>{
      console.log('BasicAdmin init done')
      setReady('done')
    })
  },[])

  
  const basicAdminSpec: Spec = BasicAdminSpecShape(spec)

  const { head, side, main, foot } = basicAdminSpec.frame.part

  console.log('side', side)

  return (
    'done' === ready ?
    <Box className='vxg-BasicAdmin'>
      { head?.active && <BasicHead ctx={ctx} spec={{head}} /> }
      { side?.active && <BasicSide ctx={ctx} spec={{side}} /> }
      { main?.active && <BasicMain ctx={ctx} spec={{main}} /> }
    </Box>
      : <Loading />
  )
}


async function init(seneca: any, done: any) {
  console.log('BasicAdmin init')

  seneca.context.vxg = (seneca.context.vxg || {})
  seneca.context.vxg.BasicAdmin = (seneca.context.vxg.BasicAdmin || {})

  // Only setup Seneca once
  if(!seneca.context.vxg.BasicAdmin.preparing) {
    seneca.context.vxg.BasicAdmin.preparing = true

    seneca.use(function BasicAdmin(this:any) {
      const seneca = this
      
      seneca
        .message(
          'aim:app,prepare:app,redux$:true',
          async function prepareApp(msg:any, meta:any) {
            let state = meta.custom.state
            state.view = {current:''}
          })

        .message(
          'aim:app,set:view,redux$:true',
          {view:String},
          async function setView(msg:any, meta:any) {
            let viewName = msg.view
            let state = meta.custom.state
            // console.log('MSG SET-VIEW', viewName, state)
            
            state.view.current = viewName
          })

        .prepare(async function() {
          this.act('aim:app,prepare:app,direct$:true')
        })
    })
    
    await seneca.ready(done)
  }
}

export {
  BasicAdmin
}
