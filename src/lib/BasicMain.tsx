import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useSearchParams, useLocation } from 'react-router-dom'

import { Box, Container } from '@mui/material'

import { Gubu } from 'gubu'

import { BasicLed } from './BasicLed'

import { searchParamsToObject } from './vxg-util'

const CMPNAME = 'BasicSide'

const { Child, Open } = Gubu
const BasicMainSpecShape = Gubu({
  main: {
    name: String,
    active: Boolean,

    view: {
      default: String,
    },
  },

  view: Child(
    Open({
      kind: String,
    })
  ),

  ux: {
    props: {
      Box: {},
      Container: {},
    },
  },
})

function BasicMain (props: any) {
  const { ctx, spec } = props
  const { seneca, cmp } = ctx()

  const basicMainSpec = BasicMainSpecShape(spec)

  const mode = useSelector((state: any) => state.main.nav.mode)
  const view = useSelector((state: any) => state.main.current.view)

  const params: any = useParams()
  const [searchParams] = useSearchParams()
  const loc: any = useLocation()

  if (view.name !== params.view) {
    seneca.act('aim:app,sync:view', {
      name: params.view,
      query: searchParamsToObject(searchParams),
      hash: loc.hash,
    })
  }

  // const viewMap = model.app.web.frame.private.view
  const viewSpec = basicMainSpec.view[view.name]
  const kind = viewSpec?.kind

  const View =
    'custom' === kind
      ? cmp[viewSpec.cmp]
      : 'led' === kind
      ? BasicLed
      : () => <div>LOADING</div>

  return (
    <Box
      className='vxg-BasicMain'
      {...basicMainSpec.ux.props.Box}
      sx={(theme: any) => ({
        // TODO: should use actual toolbar height; 16 should be from standard spacing
        marginTop: theme.mixins.toolbar.minHeight + 38 + 'px',
        marginLeft: 'shown' === mode ? 'var(--vxg-side-width)' : 0,
        marginBottom: 0,
        marginRight: 0,
      })}
    >
      <Container {...basicMainSpec.ux.props.Container}>
        {View && <View ctx={ctx} spec={viewSpec} />}
      </Container>
    </Box>
  )
}

export { BasicMain }
