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
    nav: Child({}),
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


function cmap(o:any,p:any) {
  return Object
    .entries(o)
    .reduce((r:any,n:any,_:any)=>(_=Object
      .entries(p)
      .reduce((s,m)=>(cmap.DEL===s?s:(s[m[0]]=(
        'function' === typeof m[1] ? m[1](n[1][m[0]]) : m[1]
      ),(cmap.DEL===s[m[0]]?cmap.DEL:s))),{})
    ,(cmap.DEL===_?0:r[n[0]]=_),r),{})
}
cmap.ID = (x:any)=>x
cmap.DEL = (x:any)=>x?x:cmap.DEL


async function init(seneca: any, done: any) {
  console.log('BasicAdmin init')

  seneca.context.vxg = (seneca.context.vxg || {})
  seneca.context.vxg.BasicAdmin = (seneca.context.vxg.BasicAdmin || {})

  seneca.context.cmap = cmap
  
  // Only setup Seneca once
  if(!seneca.context.vxg.BasicAdmin.preparing) {
    seneca.context.vxg.BasicAdmin.preparing = true

    seneca.use(function BasicAdmin(this:any) {
      const seneca = this
      
      seneca
        .message(
          'aim:app,prepare:app,redux$:true',
          async function prepareApp(_msg:any, meta:any) {
            let state = meta.custom.state

            let model = seneca.context.model
            let frame = model.app.web.frame.private
            let viewMap = frame.view
            // let partMap = frame.part
            let sectionMap = frame.nav.section

            state.view = {
              current:'',
            }

            state.nav = {
              
              section: cmap(sectionMap, {
                name: cmap.ID,
                active: cmap.DEL,
                item: (x:any)=>cmap(x, {
                  active: cmap.DEL,
                  view: cmap.ID,
                  name: cmap.ID,
                })
              })
              
                  /*
                Object.values(sectionMap)
                .filter((n:any)=>n.active)
                .reduce((m:any,n:any)=>(m[n.name]={
                  name: n.name,
                  active: n.active,


                  item: Object.values(n.item)
                    .filter((n:any)=>viewMap[n.view]?.active)
                    .reduce((m:any,n:any)=>(m[n.name]={
                      active: n.active,
                      view: n.view,
                      name: n.name,
},m),{})
},m),{})
*/
            }
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
          // this.act('aim:app,prepare:app,direct$:true')
          await this.post('aim:app,prepare:app')
        })
    })
    
    await seneca.ready(done)
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
