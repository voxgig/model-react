
import React from 'react'
import { useSelector } from 'react-redux'

import {
  Button,
  IconButton,
} from '@mui/material'
import {
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material'



import { Gubu } from 'gubu'

import type { BasicProps, Spec } from './basic-types'

import { BasicAccountTool } from './BasicAccountTool'



const CMPNAME = 'BasicHeadTool'
console.log(CMPNAME,'1')


const { Exact } = Gubu
const BasicHeadToolSpecShape = Gubu({
  name: String,
  active: Boolean,
  kind: String,
  align: Exact('left','right'),
  attr: {},
  sx: {},
  style: {},
}, {name: CMPNAME})


function BasicHeadTool (props: BasicProps) {
  const { ctx, spec } = props
  const { seneca } = ctx()

  const basicHeadToolSpec: Spec = BasicHeadToolSpecShape(spec)

  const mode = useSelector((state:any)=>state.main.nav.mode)


  const { name, kind, attr, sx, style } = basicHeadToolSpec

  let tool = <></>

  if('' === kind) {
    console.warn(CMPNAME, 'empty-tool-kind', basicHeadToolSpec)
  }


  // TODO: make configurable
  else if('logo' === kind) {
    tool =
    <div
      style={{
        // TODO: should come from same source as BasicSide width
        width: 'calc(var(--vxg-side-width) - 24px)',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <a
        href="/"
        style={style}
        className={`vxg-${CMPNAME}-logo`}
      >
        <img src={attr.img} />
      </a>
      <IconButton
        size="large"
        color="inherit"
        onClick={()=>seneca.act('aim:app,area:nav,set:mode', {
          mode: 'shown' === mode ? 'hidden' : 'shown'
        })}
      >
        { 'shown' === mode ? <ChevronLeft /> : <ChevronRight /> }
      </IconButton>
  </div>
  }

  
  else if('add' === kind) {
    tool = <Button
      color="inherit"
      onClick={()=>seneca.act('aim:app,part:head,tool:add,on:click')}
    >Add</Button>
  }

  
  else if('search' === kind) {
    tool = <div>SEARCH</div>
  }

  
  else if('account' === kind) {
    tool = <BasicAccountTool ctx={ctx} spec={spec}/>
  }

  
  else {
    console.warn(CMPNAME, 'unknown-tool-kind', kind, basicHeadToolSpec)
  }
  
  return tool
}


export {
  BasicHeadTool
}
