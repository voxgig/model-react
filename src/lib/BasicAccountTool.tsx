
import React from 'react'
import { useSelector } from 'react-redux'

import {
  Button,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material'


import { Gubu } from 'gubu'

import type { BasicProps, Spec } from './basic-types'




const CMPNAME = 'BasicAccountTool'
console.log(CMPNAME,'1')


const { Exact } = Gubu
const BasicAccountToolSpecShape = Gubu({
  name: String,
  active: Boolean,
  kind: String,
  align: Exact('left','right'),
  attr: {},
  sx: {},
  style: {},
}, {prefix: CMPNAME})


function BasicAccountTool (props: BasicProps) {
  const { ctx, spec } = props
  const { seneca } = ctx()

  const basicAccountToolSpec: Spec = BasicAccountToolSpecShape(spec)

  const auth = useSelector((state:any)=>state.main.auth)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = ()=>seneca.act('aim:req,on:auth,signout:user',()=>{
    document.location = '/'
  })

  
  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        >
        <Avatar
          {...stringAvatar(auth.user?.email)}
        />
      </Button>
      <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
        >
        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
      </Menu>
    </>
  )
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
  BasicAccountTool
}
