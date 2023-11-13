import React from 'react'
import { render, screen, RenderOptions } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import thunk from 'redux-thunk'
import configureStore from 'redux-mock-store'

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

export function customRender (
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
              kind: 'basic'
            },
            private: {
              kind: 'basic',
              part: {
                admin: {},
                head: {
                  logo: {
                    img: '/voxgig.png'
                  },
                  tool: {
                    def: {
                      addbutton: {
                        kind: 'add',
                        label: 'Add',
                        options: {
                          kind: 'ent',
                          label: {
                            field: 'title'
                          },
                          ent: 'vxg/task'
                        }
                      },
                      autocomplete: {
                        kind: 'autocomplete',
                        label: 'Autocomplete',
                        options: {
                          kind: 'ent',
                          label: {
                            field: 'title'
                          },
                          ent: 'vxg/task'
                        }
                      }
                    }
                  }
                },
                side: {
                  logo: {
                    img: '/voxgig.png'
                  },
                  section: {
                    section1: {
                      title: 'Section 1',
                      item: {
                        task: {
                          kind: 'resource',
                          label: 'Tasks',
                          icon: 'done',
                          path: 'view/task',
                          access: {
                            admin: true,
                            user: true
                          }
                        }
                      }
                    }
                  }
                },
                main: {
                  title: 'Main'
                },
                foot: {
                  title: 'Footer'
                }
              },
              view: {
                task: {
                  name: 'task',
                  content: {
                    kind: 'led',
                    def: {
                      canon: 'vxg/task',
                      add: {
                        active: false
                      },
                      fields: {
                        id: {
                          label: 'ID',
                          inputType: 'text',
                          required: true,
                          editable: false,
                          type: 'String'
                        },
                        title: {
                          type: 'String',
                          inputType: 'text',
                          label: 'Title',
                          required: true,
                          editable: true
                        },
                        status: {
                          type: 'String',
                          inputType: 'select',
                          label: 'Status',
                          required: true,
                          editable: true,
                          options: {
                            open: {
                              label: 'Open'
                            },
                            closed: {
                              label: 'Closed'
                            }
                          }
                        }
                      },
                      id: {
                        field: 'id'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    content: {},
    seneca: {
      entity: () => ({
        list$: q => Promise.resolve([]) // Mock the list$ function to return an empty array
      })
    },
    custom: {
      BasicLed: {
        query: (view: any, cmpstate: any) => {}
      }
    }
  }
}

export const spec = {
  frame: 'private'
}

export const initialState = {
  main: {
    auth: { user: { name: 'name' } },
    vxg: {
      cmp: {
        BasicHead: {
          tool: {
            addbutton: {},
            autocomplete: {
              selected: {
                title: 'Title'
              }
            }
          }
        },
        BasicSide: {
          show: true
        }
      },
      trigger: { led: { add: {} } },
      ent: {
        list: {
          main: {
            'vxg/task': [
              {
                entity$: '-/vxg/task',
                id: 't01',
                title: 'Task 1',
                status: 'open'
              }
            ]
          }
        },
        meta: {
          main: {
            'vxg/task': { state: 'none' }
          }
        }
      }
    }
  }
}
