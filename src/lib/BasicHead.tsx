
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { useNavigate, useLocation } from 'react-router-dom'

import { Gubu, Exact } from 'gubu'

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


function onOpen(seneca: any) {
  seneca.act('aim:app,set:state', {
    section: 'vxg.cmp.BasicSide.show',
    content: true
  })
}

const filter = createFilterOptions()

function resolveOptions(tooldef: any, tooldata: any) {
  let options = []

  if ('ent' === tooldef.options.kind && tooldata[tooldef.name]) {
    let ents = tooldata[tooldef.name].ents || []
    options = ents.map((ent: any) => ({
      label: ent[tooldef.options.label.field],
      ent
    }))
  }

  return options
}

function addItem(seneca: any, led_add: any) {
  seneca.act('aim:app,set:state', {
    section: 'vxg.trigger.led.add',
    content: ++led_add
  })
}

function BasicHead(props: any) {
  const {
    vxg,
    ctx,
    spec
  } = props

  const { seneca } = ctx()

  const {
    frame
  } = spec

  // console.log('BasicHead.spec', spec)

  // spec schema definition with Gubu
  const shape = Gubu({
    head: {
      logo: { img: "" },
      tool: { def: [{ kind: Exact('addbutton', 'autocomplete'), title: String, options: {}, name: "" }] },
    },
    view: {}
  })

  // spec schema validation with Gubu
  shape(spec)

  const navigate = useNavigate()
  const location = useLocation()

  const tooldefs = Object.entries(spec.head.tool.def)
    .map((entry: any) => (entry[1].name = entry[0], entry[1]))


  const user = useSelector((state: any) => state.main.auth.user)
  const userName = user.name || user.email

  let valuemap: any = {}
  let tooldata: any = {}
  tooldefs.forEach(tooldef => {
    if ('autocomplete' === tooldef.kind) {
      if ('ent' === tooldef.options.kind) {
        let canon = tooldef.options.ent
        tooldata[tooldef.name] = {
          ents: useSelector((state: any) => state.main.vxg.ent.list.main[canon])
        }

        let selected = useSelector((state: any) =>
          state.main.vxg.cmp.BasicHead.tool[tooldef.name].selected)

        if (selected) {
          valuemap[tooldef.name] = {
            label: selected[tooldef.options.label.field],
            ent: selected
          }
        }
      }
    }
  })



  const vxgState = useSelector((state: any) => state.main.vxg)
  const open = vxgState.cmp.BasicSide.show
  let led_add = vxgState.trigger.led.add

  const viewPath: any = location.pathname.split('/')[2]
  let add = spec.view[viewPath].content.def.add || { active: false }


  let drawerwidth = '16rem'

  return (
    <BasicAppBar
      // position="fixed"
      drawerwidth={drawerwidth}
      open={open}
      sx={{
        color: 'black',
        bgcolor: 'white'
      }}
    >
      <Toolbar>

        <IconButton
          aria-label="open drawer"
          onClick={() => onOpen(seneca)}
          edge="start"
          sx={{
            marginRight: 2,
            ...(open && { display: 'none' })
          }}
        >
          <ChevronRightIcon />
        </IconButton>



        {tooldefs.map(tooldef => {
          if ('autocomplete' === tooldef.kind) {
            return <Autocomplete
              freeSolo
              forcePopupIcon
              value={valuemap[tooldef.name] || tooldef.defaultvalue || ''}
              key={tooldef.name}
              options={resolveOptions(tooldef, tooldata)}
              // disableClearable={ typeof vxg.cmp.BasicHead.tool[tooldef.name].selected != 'object' }
              size='small'
              sx={{
                paddingLeft: '1em',
                width: '20rem',
              }}
              filterOptions={(options: any, params: any) => {
                const filtered = filter(options, params)
                // const { inputValue } = params
                return filtered
              }}
              renderInput={(params) => <TextField {...params} label={tooldef.title} />}
              onChange={(event: any, newval: any) => {
                seneca.act('aim:app,set:state', {
                  section: 'vxg.cmp.BasicHead.tool.' + tooldef.name + '.selected',
                  content: 'search' == tooldef.mode && typeof newval === 'string' ?
                    { [tooldef.options.label.field]: newval } : newval?.ent,
                })
              }}
              isOptionEqualToValue={(opt: any, val: any) =>
                (opt === val) || (null != opt && null != val && opt.ent?.id === val.ent?.id)}
            />
          } else if ('addbutton' === tooldef.kind) {
            return <BasicButton variant="outlined"
              key={tooldef.name}
              sx={{
                display: add.active ? null : 'none',
                textTransform: 'capitalize',
              }}
              size="large"

              onClick={() => addItem(seneca, led_add)}
            >
              {tooldef.title + ' ' + model.app.web.frame.private.view[viewPath].name}
            </BasicButton>

          }
        }
        )}

        <div style={{ flexGrow: 1 }}></div>

        <Typography variant="h6">
          {userName}
        </Typography>
      </Toolbar>
    </BasicAppBar>
  )
}

export default BasicHead
