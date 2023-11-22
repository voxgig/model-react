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
          active: Boolean
        },
        state: {},
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

  // TODO: Refactor this
  const basicMainStyle = {
    paddingLeft: sideOpen ? '14rem' : '0rem',
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
      {Object.entries(view.content.def.state).map(([key, state]: any) => {
        const Cmp = state.kind === 'custom' ? ctx().cmp[state.cmp] : BasicLed

        let routePath
        if (state.render === 'member') {
          routePath = `/view/${view.name}/:${view.paramId}/${key}`
        } else {
          routePath = `/view/${view.name}/${key}`
        }

        console.log('routePath', routePath)

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
