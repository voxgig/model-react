import React, { Fragment } from 'react'

import { useSelector } from 'react-redux'

import { Routes, Route } from 'react-router-dom'

import BasicLed from './BasicLed'
import { Child, Exact, Gubu } from 'gubu'
import { Box } from '@mui/material'

// Validate spec shape with Gubu
const BasicMainSpecShape = Gubu({
  main: {},
  view: Child({
    name: String,
    title: String,
    icon: String,
    content: {
      kind: Exact('led', 'custom'),
      def: {
        ent: {
          primary: {
            field: {
              id: {
                title: String,
                edit: Boolean
              }
            }
          }
        },
        add: {
          active: Boolean
        },
        edit: {
          layout: {
            order: String,
            field: Child({
              type: String,
              headerName: String,
              edit: Boolean,
              kind: Child({
                title: String
              })
            })
          }
        }
      }
    }
  })
})

function BasicMain (props: any) {
  const { vxg, ctx } = props
  const { model, content } = ctx()

  const basicMainSpec = BasicMainSpecShape(props.spec)
  const views = Object.values(basicMainSpec.view)
  const sideOpen = useSelector(
    (state: any) => state.main.vxg.cmp.BasicSide.show
  )

  const style = {
    paddingLeft: sideOpen ? '16rem' : '0rem'
  }

  return (
    <Box className='basic-main' sx={style}>
      <Box className='basic-main-container' sx={{ height: '100%' }}>
        <Routes>
          <Route path='/view'>
            {views.map((view: any) => {
              const Cmp: any = makeCmp(view, ctx)
              if (view.paramId) {
                return (
                  <Fragment key={view.name}>
                    <Route
                      key={view.name}
                      path={'/view/' + view.name}
                      element={<Cmp vxg={vxg} ctx={ctx} spec={view} />}
                    />
                    <Route
                      key={view.name}
                      path={'/view/' + view.name + '/:' + view.paramId}
                      element={<Cmp vxg={vxg} ctx={ctx} spec={view} />}
                    />
                  </Fragment>
                )
              }
              return (
                <Route
                  key={view.name}
                  path={'/view/' + view.name}
                  element={<Cmp vxg={vxg} ctx={ctx} spec={view} />}
                />
              )
            })}
          </Route>
        </Routes>
      </Box>
    </Box>
  )
}

export default BasicMain

function makeCmp (view: any, ctx: any) {
  let cmp: any = () => <div>NONE</div>

  const content = view.content || {}

  // TODO: Refactor this
  if ('custom' === content.kind) {
    cmp = ctx().cmp[content.cmp]
  } else if ('led' === content.kind) {
    cmp = BasicLed
  }

  return cmp
}
