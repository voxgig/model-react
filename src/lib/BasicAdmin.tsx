import React, { useEffect, useState } from 'react'

import { Box, Container } from '@mui/material'

import SenecaEntity from 'seneca-entity'
import BrowserStore from '@seneca/browser-store'

import { Gubu } from 'gubu'

import type { BasicProps, Spec } from './basic-types'

import { VxgBasicAdminPlugin } from './VxgBasicAdminPlugin'

import { BasicHead } from './BasicHead'
import { BasicMain } from './BasicMain'
import { BasicSide } from './BasicSide'

/*


import BasicFoot from './BasicFoot'
*/


const CMPNAME = 'BasicAdmin'
console.log('BasicAdmin 1')


const { Child } = Gubu
const BasicAdminSpecShape = Gubu({
  frame: {
    name: String,
    kind: String,
    part: {},
    view: {},
    nav:  {},
    tool: {},
  }
}, {prefix: CMPNAME})


// TODO: need a BasicLoadingSplash
function Loading() {
  return <Container>LOADING</Container>
}


function BasicAdmin (props: BasicProps) {
  const { ctx, spec } = props
  const ctxval = ctx()
  const { model } = ctxval
  
  const [ready, setReady] = useState('init')
  
  useEffect(()=>{
    console.log('BasicAdmin useEffect', ready)
    if('init' !== ready) {
      return
    }
    init(ctxval, ()=>{
      console.log('BasicAdmin init done')
      setReady('done')
    })
  },[])

  
  const basicAdminSpec: Spec = BasicAdminSpecShape(spec)

  const { head, side, main, foot } = basicAdminSpec.frame.part

  
  // TODO: Review source of mui styles
  // NOTE: keep separate from frontend part definitions as implementation
  const headSpec = {
    head,
    tool: model.app.web.frame.private.tool,
    mui: {
      // TODO: set in theme: https://mui.com/material-ui/customization/z-index/
      AppBar: { style: { zIndex: 4000 } }
    }
  }

  const sideSpec = {
    side,
    view: model.app.web.frame.private.view,
    mui: {
      Drawer: { style: { zIndex: 3000 } }
    }
  }
  
  const mainSpec = {
    main,
    view: model.app.web.frame.private.view,
    mui: {
      Container: { style: { zIndex: 1000 } }
    }
  }

  return (
    'done' === ready ?
    <Box className='vxg-BasicAdmin'>
      { head?.active && <BasicHead ctx={ctx} spec={headSpec} /> }
      { side?.active && <BasicSide ctx={ctx} spec={sideSpec} /> }
      { main?.active && <BasicMain ctx={ctx} spec={mainSpec} /> }
    </Box>
      : <Loading />
  )
}




async function init(ctx: any, done: any) {
  console.log('BasicAdmin init')

  const { seneca, router } = ctx
  
  seneca.context.vxg = (seneca.context.vxg || {})
  seneca.context.vxg.BasicAdmin = (seneca.context.vxg.BasicAdmin || {})

  // Only setup Seneca once
  if(!seneca.context.vxg.BasicAdmin.preparing) {
    seneca.context.vxg.BasicAdmin.preparing = true
    
    seneca
      .use(VxgBasicAdminPlugin)
    // await seneca.ready(done)
    await seneca.ready()
    console.log('BasicAdmin READY DONE')
    return done()
  }
}

export {
  BasicAdmin
}


/*

{
  type: 'main/update',
  payload: { msg: {section: 'nav.section.one.item.search.active', content: true }}
}

 */
