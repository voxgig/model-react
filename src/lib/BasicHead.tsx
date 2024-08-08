import React from 'react'

import AppBar from '@mui/material/AppBar'
import ToolBar from '@mui/material/Toolbar'

import { Gubu } from 'gubu'

import type { BasicProps, Spec } from './basic-types'

import { BasicHeadTool } from './BasicHeadTool'

const CMPNAME = 'BasicHead'

const { Child, Exact, Open, Required } = Gubu
const BasicHeadSpecShape = Gubu(
  {
    head: {
      name: String,
      active: Boolean,

      tool: Child(
        Open({
          align: Exact('left', 'right'),
        })
      ),
    },

    tool: Required({}),

    // Set MUI component props directly
    ux: {
      props: {
        AppBar: {},
        ToolBar: {},
      },
    },
  },
  { name: CMPNAME }
)

function BasicHead (props: BasicProps) {
  const { ctx, spec } = props
  const { seneca } = ctx()
  const { vmap } = seneca.context

  const basicHeadSpec: Spec = BasicHeadSpecShape(spec)
  const { head } = basicHeadSpec as any

  const tools = vmap(head.tool, {
    active: vmap.FILTER,
    name: vmap.FILTER((_: any, p: any) => [
      basicHeadSpec.tool[p.key]?.active,
      p.key,
    ]),
    align: vmap.COPY,
  }).map((t: any) => ({
    ...basicHeadSpec.tool[t.name],
    ...t,
  }))

  const leftTools: Spec[] = tools.filter((t: Spec) => 'left' === t.align)
  const rightTools: Spec[] = tools.filter((t: Spec) => 'right' === t.align)

  return (
    <AppBar className='vxg-BasicHead' {...spec.ux.props.AppBar}>
      <ToolBar className='vxg-BasicHead-toolbar' {...spec.ux.props.ToolBar}>
        <div className='vxg-BasicHead-toolbar vxg-BasicHead-toolbar-left'>
          {leftTools.map((t) => (
            <BasicHeadTool key={t.name} ctx={ctx} spec={t} />
          ))}
        </div>
        <div
          className='vxg-BasicHead-toolbar vxg-BasicHead-toolbar-right'
          style={{ marginLeft: 'auto' }}
        >
          {rightTools.map((t) => (
            <BasicHeadTool key={t.name} ctx={ctx} spec={t} />
          ))}
        </div>
      </ToolBar>
    </AppBar>
  )
}

export { BasicHead }
