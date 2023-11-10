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
    name: String,
    content: {
      kind: Exact('led', 'custom'),
      editingMode: 'form',
      foot: {},
      head: {},
      cmp: Skip(String),
      def: {
        canon: Skip(String),
        add: {
          active: Boolean
        },
        id: Skip({
          field: String
        }),
        fields: Skip({})
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
    paddingLeft: sideOpen ? '16rem' : '0rem',
    backgroundColor: theme.palette.background.default
  }

  // TODO: Refactor this
  const basicMainContainerStyle = {
    height: '100%'
  }

  return (
    <Box className='basic-main' sx={basicMainStyle}>
      <Box className='basic-main-container' sx={basicMainContainerStyle}>
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
                      element={
                        <>
                          <ThemeProvider theme={theme}>
                            <Cmp vxg={vxg} ctx={ctx} spec={view} />
                          </ThemeProvider>
                        </>
                      }
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
                  element={
                    <>
                      <ThemeProvider theme={theme}>
                        <Cmp vxg={vxg} ctx={ctx} spec={view} />
                      </ThemeProvider>
                    </>
                  }
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
  const content = view.content || {}
  const cmp = content.kind === 'custom' ? ctx().cmp[content.cmp] : BasicLed
  return cmp
}
