
import React from 'react'

import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'

import { Gubu } from 'gubu'

import type { BasicProps, Spec } from './basic-types'



const { Exact } = Gubu


const cmpname = 'BasicHeadTool'

const BasicHeadToolSpecShape = Gubu({
  name: String,
  active: Boolean,
  kind: String,
  align: Exact('left','right'),
  attr: {},
  sx: {},
  style: {},
}, {prefix:cmpname})


function BasicHeadTool (props: BasicProps) {
  const { ctx, spec } = props
  const { seneca } = ctx()

  console.log(cmpname, spec)
  const basicHeadToolSpec: Spec = BasicHeadToolSpecShape(spec)

  const { name, kind, attr, sx, style } = basicHeadToolSpec

  let tool = <></>

  if('' === kind) {
    console.warn(cmpname, 'empty-tool-kind')
  }

  
  else if('logo' === kind) {
    tool =
    <a
      href="/"
      style={style}
      className={`vxg-${cmpname}-logo`}
    >
      <img src={attr.img} />
    </a>
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
    tool = <Avatar>AB</Avatar>
  }

  
  else {
    console.warn(cmpname, 'unknown-tool-kind', kind)
  }
  
  return tool
}

export {
  BasicHeadTool
}
