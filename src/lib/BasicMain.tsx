
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
    paddingLeft: sideOpen ? '12.0em' : '0em',
    paddingRight: 0
  }
  const mainDiv = {
    height: 'calc(100vh - 6rem)',
    width: sideOpen ? 'calc(100vw - 19rem)' : 'calc(100vw - 4rem)',
    padding: '84px ' + (sideOpen ? '4.5em' : '0') + ' 4.5em ' + (sideOpen ? '4.5em' : '0.5em')
  }

  return (
    <div className="BasicMain" style={mainDiv}>
      <div style={{ width: '100%', height: '100%', ...divStyle }}>
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
