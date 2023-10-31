import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { useNavigate, useLocation } from 'react-router-dom'

import { Gubu, Exact, Child, Open } from 'gubu'

import {
  Toolbar,
  TextField,
  Autocomplete,
  Typography,
  IconButton,
  createFilterOptions
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import BasicButton from './BasicButton'
import BasicAppBar from './BasicAppBar'
import BasicAutocomplete from './BasicAutocomplete'

const BasicHeadSpecShape = Gubu({
  head: {
    logo: {
      img: String
    },
    tool: {
      def: Child({
        kind: Exact('addbutton', 'autocomplete'),
        label: String,
        options: {
          kind: String,
          label: {
            field: String
          },
          ent: String
        },
        name: ''
      })
    },
    app: {}
  },
  view: {}
})

function BasicHead (props: any) {
  const { vxg, ctx } = props

  const { seneca } = ctx()

  // spec schema validation with Gubu
  const basicHeadSpec = BasicHeadSpecShape(props.spec)

  const navigate = useNavigate()
  const location = useLocation()

  const tooldefs = Object.entries(basicHeadSpec.head.tool.def).map(
    (entry: any) => ((entry[1].name = entry[0]), entry[1])
  )

  const user = useSelector((state: any) => state.main.auth.user)
  const userName = user.name || user.email

  const vxgState = useSelector((state: any) => state.main.vxg)
  const open = vxgState.cmp.BasicSide.show
  let led_add = vxgState.trigger.led.add

  const viewPath: any = location.pathname.split('/')[2]
  let add = basicHeadSpec.view[viewPath]?.content?.def?.add || { active: false }

  return (
    <BasicAppBar
      // position="fixed"
      drawerwidth='16rem'
      open={open}
      sx={{
        color: 'black',
        bgcolor: 'white'
      }}
    >
      <Toolbar>
        <IconButton
          aria-label='open drawer'
          onClick={() => onOpen(seneca)}
          edge='start'
          sx={{
            marginRight: 2,
            ...(open && { display: 'none' })
          }}
        >
          <ChevronRightIcon />
        </IconButton>

        {tooldefs.map(tooldef => {
          if ('autocomplete' === tooldef.kind) {
            return (
              <BasicAutocomplete
                spec={{ tooldef: tooldef }}
                ctx={ctx}
                key={tooldef.name}
              />
            )
          } else if ('addbutton' === tooldef.kind) {
            return (
              <BasicButton
                variant='outlined'
                key={tooldef.name}
                sx={{
                  display: add.active ? null : 'none',
                  textTransform: 'capitalize'
                }}
                size='large'
                onClick={() => addItem(seneca, led_add)}
              >
                {tooldef.label + ' ' + basicHeadSpec.view[viewPath]?.name}
              </BasicButton>
            )
          }
        })}

        <div style={{ flexGrow: 1 }}></div>

        <Typography variant='h6'>{userName}</Typography>
      </Toolbar>
    </BasicAppBar>
  )
}

export default BasicHead

function onOpen (seneca: any) {
  seneca.act('aim:app,set:state', {
    section: 'vxg.cmp.BasicSide.show',
    content: true
  })
}

function addItem (seneca: any, led_add: any) {
  seneca.act('aim:app,set:state', {
    section: 'vxg.trigger.led.add',
    content: ++led_add
  })
}
