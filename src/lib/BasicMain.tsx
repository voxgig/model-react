
import React, { Fragment } from 'react'

import { useSelector } from 'react-redux'

import {
  Routes,
  Route
} from 'react-router-dom'

import BasicLed from './BasicLed'
import { Gubu } from 'gubu'


function makeCmp(view: any, ctx: any) {
  let cmp: any = () => <div>NONE</div>

  const content = view.content || {}

  if ('custom' === content.kind) {
    cmp = ctx().cmp[content.cmp]
  }
  else if ('led' === content.kind) {
    cmp = BasicLed
  }

  return cmp
}



function BasicMain(props: any) {
  const {
    vxg,
    ctx,
    spec
  } = props
  const { model, content } = ctx()

  const { frame } = spec

  // spec schema definition with Gubu
  const shape = Gubu({
    main: {},
    view: {}
  })

  // spec schema validation with Gubu
  shape(spec)

  const part = spec.main

  const views = Object.values(spec.view)

  const sideOpen = useSelector((state: any) => state.main.vxg.cmp.BasicSide.show)


  const divStyle = {
    marginLeft: '2em',
    marginRight: '2em',
    marginTop: '3em'
  }

  const mainDiv = {
    width: sideOpen ? 'calc(100% - 16rem)' : '100%',
    paddingLeft: sideOpen ? '16rem' : '0rem'
  }

  return (
    <div className='BasicMain' style={mainDiv}>
      <div style={{ ...divStyle }}>
        <Routes>
          <Route path='/view'>
            {
              views.map((view: any) => {
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
                    </Fragment>)
                }
                return <Route
                  key={view.name}
                  path={'/view/' + view.name}
                  element={<Cmp vxg={vxg} ctx={ctx} spec={view} />}
                />
              })
            }
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default BasicMain
