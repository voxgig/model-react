import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import BasicLed from './BasicLed'
import { Exact, Gubu } from 'gubu'
import { Box, ThemeProvider, useTheme } from '@mui/material'

const { Child, Optional, Skip } = Gubu

// Validate spec shape with Gubu
const BasicMainSpecShape = Gubu({
  main: {
    title: String
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
          kind: 'led',
          active: Skip(Boolean),
          cmp: Skip(String),
          editingMode: 'none',
          head: {
            cmp: Skip(String)
          },
          foot: {
            cmp: Skip(String)
          }
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

function BasicMain (props: any) {
  const { vxg, ctx } = props
  const theme = useTheme()
  const basicMainSpec = BasicMainSpecShape(props.spec)
  const views = Object.values(basicMainSpec.view)
  const sideOpen = useSelector(
    (state: any) => state.main.vxg.cmp.BasicSide.show
  )

  const paddingLeft =
    theme.components?.MuiDrawer?.styleOverrides?.paper?.width || '16rem'

  // TODO: Refactor this
  const basicMainStyle = {
    paddingLeft: sideOpen ? paddingLeft : '0rem',
    backgroundColor: theme.palette.background.default
  }

  // TODO: Refactor this
  const basicMainContainerStyle = {
    height: '100%'
  }

  return (
    <Box className='BasicMain' sx={basicMainStyle}>
      <Box className='BasicMain-container' sx={basicMainContainerStyle}>
        <Routes>
          <Route path='/view'>{renderRoutes(views, vxg, ctx, theme)}</Route>
        </Routes>
      </Box>
    </Box>
  )
}

export default BasicMain

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
                  <Cmp vxg={vxg} ctx={ctx} spec={view} />
                </ThemeProvider>
              }
            />
          </Fragment>
        )
      })}
    </Fragment>
  ))
}
