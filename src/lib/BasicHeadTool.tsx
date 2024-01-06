
import React from 'react'
import { useSelector } from 'react-redux'

import {
  Button,
  IconButton,
  Avatar,
} from '@mui/material'
import {
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material'



import { Gubu } from 'gubu'

import type { BasicProps, Spec } from './basic-types'




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
}, {prefix: CMPNAME})


function BasicHeadTool (props: BasicProps) {
  const { ctx, spec } = props
  const { seneca } = ctx()

  const basicHeadToolSpec: Spec = BasicHeadToolSpecShape(spec)

  const mode = useSelector((state:any)=>state.main.nav.mode)
  const auth = useSelector((state:any)=>state.main.auth)


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
    // TODO: needs own cmp
    // https://mui.com/material-ui/react-menu/
    tool = <Avatar {...stringAvatar(auth.user?.email)} />
  }

  
  else {
    console.warn(CMPNAME, 'unknown-tool-kind', kind, basicHeadToolSpec)
  }
  
  return tool
}


function stringToColor(string: string) {
  let hash = 0
  let i: any

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function stringAvatar(s: string) {
  s = null == s ? '' : s
  s = s.toUpperCase().split('@')[0] || ''
  let parts = s.split(/[-\s_.]+/)
  // console.log('QQQ',s,parts,(parts[0]||'')[1], (parts[1]||'')[0])
  parts[1] = (parts[1]||'')[0] || (parts[0]||'')[1] || '-'
  parts[0] = (parts[0]||'')[0] || '-'
  
  return {
    sx: {
      bgcolor: stringToColor(s),
    },
    children: `${parts.join('')}`,
  }
}

export {
  BasicHeadTool
}
