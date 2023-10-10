import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'
import '@testing-library/jest-dom'
import type { RenderOptions } from '@testing-library/react'

interface IExtendedRenderOptions extends RenderOptions {
  withRouter?: boolean
  withRedux?: boolean
  mockInitialState?: any
}

const wrapInRouter = (componentTree: JSX.Element) => (
  <BrowserRouter>{componentTree}</BrowserRouter>
)

const wrapInRedux = (
  componentTree: JSX.Element,
  { mockInitialState }: IExtendedRenderOptions
) => {
  const storeMock = configureStore([thunk])(mockInitialState)
  return <Provider store={storeMock}>{componentTree}</Provider>
}

const setupComponent = (
  ui: JSX.Element,
  renderOptions?: IExtendedRenderOptions
) => {
  let componentTree = <>{ui}</>
  componentTree = wrapInRouter(componentTree)
  componentTree = wrapInRedux(componentTree, renderOptions)
  return componentTree
}

export function customRender(
  ui: JSX.Element,
  renderOptions?: IExtendedRenderOptions
) {
  const componentTree = setupComponent(ui, renderOptions)

  const { debug: originalDebug, ...rest } = render(componentTree)

  const debug = () => {
    originalDebug()
  }

  return {
    debug,
    screen,
    ...rest
  }
}

export const vxg = {
  cmp: {
    BasicSide: { show: {} }
  },
  trigger: { led: { add: {} } },
  ent: {
    meta: { main: { canon: { state: {} } } },
    list: { main: { canon: {} } }
  }
}

export const ctx = () => {
  return {
    model: {
      app: {
        web: {
          frame: {
            public: {
              part: {
                foot: {},
                head: {
                  tool: {
                    def: [
                      { kind: 'addbutton', title: 'Add', options: { kind: 'ent', label: { field: 'title' }, ent: 'vxg/task' } },
                      { kind: 'autocomplete', title: 'Autocomplete', options: { kind: 'ent', label: { field: 'title' }, ent: 'vxg/task' } }
                    ]
                  }
                },
                side: { logo: { img: {} } }
              },
              view: {}
            },
            private: {
              part: {
                foot: {},
                head: { logo: { img: '' }, tool: { def: [] } },
                side: { logo: { img: {} } }
              },
              view: {
                undefined: { content: { def: { add: {} } }, name: 'view' }
              }
            }
          }
        }
      }
    },
    content: {},
    seneca: {},
    custom: {}
  }
}

export const spec = {
  frame: 'private',
  // img: { logo: {} },
  // handle: { signin: () => {} },
  // content: { def: { ent: { canon: 'canon' } } }
}

export const initialState = {
  main: {
    auth: { user: { name: 'name' } },
    vxg: {
      cmp: {
        BasicHead: {
          tool: [
            { selected: true },
            { selected: false },
          ]
        },
        BasicSide: {
          show: true
        }
      },
      trigger: { led: { add: {} } },
      ent: {
        meta: { main: { canon: { state: {} } } },
        list: { main: { canon: {} } }
      }
    }
  }
}
