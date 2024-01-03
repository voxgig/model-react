import React, { useState } from 'react'

import { useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import BasicLed from './BasicLed'


import { Box, CSSObject, ThemeProvider, useTheme } from '@mui/material'

import { Gubu } from 'gubu'

const { Child, Skip } = Gubu


console.log('BasicMain 1')


// Validate spec shape with Gubu
const BasicMainSpecShape = Gubu({
  main: {
    view: {
      default: String
    }
  },
  view: Child({
    title: String,
    paramId: Skip(String),
    name: String,
    content: {
      def: {
        canon: Skip(String),
        add: {
          active: true
        },
        subview: Child({
          render: 'collection',
          default: false,
          kind: 'led',
          active: Skip(Boolean),
          cmp: Skip(String),
          editingMode: 'none',
          head: {
            cmp: Skip(String)
          },
          foot: {
            cmp: Skip(String)
          },
          linkPath: Skip(String),
          enableColumnFilters: false
        }),
        id: Skip({
          field: String
        }),
        field: Skip({}),
        columnVisibility: Skip({})
      }
    }
  })
})


function Foo() {
  return <div><h1>FOO</h1><Link to="/view/bar">bar</Link></div>
}

function Bar() {
  return <div><h1>BAR</h1><Link to="/view/foo">foo</Link></div>
}

const viewMap: any = {
  foo: Foo,
  bar: Bar,
}


function BasicMain (props: any) {
  /*
  const { vxg, ctx } = props
  const theme = useTheme()
  const basicMainSpec = BasicMainSpecShape(props.spec)
  const views = Object.values(basicMainSpec.view)
  const defaultRoute = basicMainSpec.main.default
  const sideOpen = useSelector(
    (state: any) => state.main.vxg.cmp.BasicSide.show
  )
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === '/' && defaultRoute !== undefined) {
      navigate(defaultRoute)
    }
  }, [location, navigate])

  const paddingLeft =
    (theme.components?.MuiDrawer?.styleOverrides?.paper as CSSObject)?.width ||
    '16rem'

  // TODO: Refactor this
  const basicMainStyle = {
    paddingLeft: sideOpen ? paddingLeft : '0rem',
    backgroundColor: theme.palette.background.default
  }

  // TODO: Refactor this
  const basicMainContainerStyle = {
    height: '100%'
  }
    <Box className='BasicMain' sx={basicMainStyle}>
      <Box className='BasicMain-container' sx={basicMainContainerStyle}>

  <Routes>{renderRoutes(views, vxg, ctx, theme)}</Routes>
   */

  const { ctx, spec } = props
  const { seneca } = ctx()

  const viewName = useSelector((state:any)=>state.main.view.current)
  
  const params:any = useParams()

  if(viewName !== params.view) {
    seneca.act('aim:app,set:view', {view:params.view})
  }
  
  const View = viewMap[viewName]

  const viewSpec = {}
  
  return (
    <Box className='vxg-BasicMain'>
      <Box className='vxg-BasicMain-container'>
        { View && <View ctx={ctx} spec={viewSpec} /> }
      </Box>
    </Box>
  )
}

export {
  BasicMain
}


/*
const renderRoutes = (views: any[], vxg: any, ctx: any, theme: any) => {
  return views.map((view: any) => (
    <Fragment key={view.name}>
      {Object.entries(view.content.def.subview).map(([key, subview]: any) => {
        const Cmp =
          subview.kind === 'custom' ? ctx().cmp[subview.cmp] : BasicLed

        let routePath
        if (subview.render === 'member') {
          routePath = `/view/${view.name}/:${view.paramId}/${key}`
        } else {
          routePath = `/view/${view.name}/${key}`
        }

        return (
          <Fragment key={key}>
            <Route
              path={routePath}
              element={
                <ThemeProvider theme={theme}>
                  <Cmp key={key} action={key} vxg={vxg} ctx={ctx} spec={view} />
                </ThemeProvider>
              }
            />
          </Fragment>
        )
      })}
    </Fragment>
  ))
}
*/
